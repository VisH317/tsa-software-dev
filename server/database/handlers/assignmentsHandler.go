package handlers

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"fmt"
	"time"
	"sort"
	"github.com/lib/pq"
)

type Assignment struct {
	Id int
	Classroomid int
	Title string
	Descr string
	Duedate string
	MaxGroup int
}

type AssignmentResponse struct {
	Assignmentid int
	Users []string
	Content string
	Duedate string
}

const RFC3339 = "2006-01-02T15:04:05.000Z"

func CreateAssignment(c *fiber.Ctx, db *sql.DB) error {
	newAssignment := Assignment{}
	if err := c.BodyParser(&newAssignment); err!=nil {
		fmt.Println(err)
	}

	fmt.Println("creating assignment!")
	date, _ := time.Parse(RFC3339, newAssignment.Duedate)

	fmt.Println("cid: ", newAssignment.Classroomid)

	_, err := db.Exec("INSERT INTO assignments (classroomid, title, descr, duedate, maxgroup) VALUES ($1, $2, $3, $4, $5)", newAssignment.Classroomid, newAssignment.Title, newAssignment.Descr, date, newAssignment.MaxGroup)
	if err!=nil {
		fmt.Println(err)
	}
	return c.JSON(newAssignment)
}

func GetAssignmentsForClass(c *fiber.Ctx, db *sql.DB) error {
	class := c.Query("class")
	rows, err := db.Query("SELECT id, classroomid, title, descr, duedate, maxgroup FROM assignments WHERE classroomid=$1", class)
	if err!=nil {
		fmt.Println(err)
	}
	defer rows.Close()
	
	var assignments []Assignment

	for rows.Next() {
		var classroomid, id, maxgroup int
		var title, descr string
		var duedate time.Time
		rows.Scan(&id, &classroomid, &title, &descr, &duedate, &maxgroup)
		fmt.Println("title: ", title)
		fmt.Println("duedate: ", duedate)
		as := Assignment{id, classroomid, title, descr, duedate.Format(time.RFC3339), maxgroup}
		assignments = append(assignments, as)
	}

	// separate due and overdue
	var due, overdue []Assignment
	now := time.Now()

	for _, element := range assignments {
		t, err := time.Parse(RFC3339, element.Duedate)
		if err!=nil { fmt.Println(err) }

		if now.Before(t) {
			overdue = append(overdue, element)
		} else {
			due = append(due, element)
		}
	}

	if len(assignments)==0 {
		return c.JSON(make([]Assignment, 0))
	}

	sort.Slice(due, func(i, j int) bool {
		first, err := time.Parse(RFC3339, due[i].Duedate)
		if err!=nil { fmt.Println(err) }
		second, err := time.Parse(RFC3339, due[j].Duedate)
		if err!=nil { fmt.Println(err) }
		return first.Before(second)
	})

	sort.Slice(overdue, func(i, j int) bool {
		first, err := time.Parse(RFC3339, overdue[i].Duedate)
		if err!=nil { fmt.Println(err) }
		second, err := time.Parse(RFC3339, overdue[j].Duedate)
		if err!=nil { fmt.Println(err) }
		return first.Before(second)
	})

	sortedAssignments := append(due, overdue[:]...)

	return c.JSON(sortedAssignments)
}

func GetAssignmentByID(c *fiber.Ctx, db *sql.DB) error {
	id := c.Query("id")
	rows, err := db.Query("SELECT id, classroomid, title, descr, duedate, maxgroup FROM assignments WHERE id=$1", id)
	if err!=nil {
		fmt.Println(err)
	}
	defer rows.Close()

	var assignment Assignment

	for rows.Next() {
		var classroomid, id, maxgroup int
		var title, descr string
		var duedate time.Time
		rows.Scan(&id, &classroomid, &title, &descr, &duedate, &maxgroup)
		fmt.Println("title: ", title)
		fmt.Println("duedate: ", duedate)
		assignment = Assignment{id, classroomid, title, descr, duedate.Format(time.RFC3339), maxgroup}
	}

	return c.JSON(assignment)
}

func DeleteAssignment(c *fiber.Ctx, db *sql.DB) error {
	id := c.Query("id")
	fmt.Println("deleting assignments: ", id)
	db.Exec("DELETE FROM assignments WHERE id=$1", id)
	return c.SendString("success")
}

func CreateAssignmentResponse(c *fiber.Ctx, db *sql.DB) error {
	newRes := AssignmentResponse{}
	if err := c.BodyParser(&newRes); err!=nil {
		fmt.Println(err)
	}
	fmt.Println("creating assignment...")
	fmt.Println(newRes.Assignmentid)

	date := time.Now()

	_, err := db.Exec("INSERT INTO assignmentresponse (assignmentid, users, content, duedate) VALUES ($1, $2, $3, $4)", newRes.Assignmentid, pq.Array(newRes.Users), newRes.Content, date)
	if err!=nil {fmt.Println(err)}
	return c.JSON(newRes)
}

func GetAssignmentResponses(c *fiber.Ctx, db *sql.DB) error {
	assignment := c.Query("assignment")
	fmt.Println("assignment: ", assignment)
	rows, err := db.Query("SELECT assignmentid, users, content, duedate FROM assignmentresponse WHERE assignmentid=$1", assignment)
	if err!=nil {
		fmt.Println(err)
	}
	defer rows.Close()

	var resp []AssignmentResponse
	for rows.Next() {
		var asid int
		var content string
		var users []string
		var date time.Time
		rows.Scan(&asid, (*pq.StringArray)(&users), &content, &date)
		fmt.Println("asid: ", asid)
		r := AssignmentResponse{asid, users, content, date.Format(time.RFC3339)}
		resp = append(resp, r)
	}

	return c.JSON(resp)
}

type InvalidAssignmentFetch struct {
	msg string
}

func GetAssignmentResponsesStudent(c *fiber.Ctx, db *sql.DB) error {
	assignment := c.Query("assignment")
	user := c.Query("user")
	if len(user)==0 || len(assignment)==0 {
		return c.JSON(InvalidAssignmentFetch{"loading"})
	}
	
	fmt.Println("as: ", assignment)
	fmt.Println("user: ", user)

	rows, err := db.Query("SELECT assignmentid, users, content, duedate FROM assignmentresponse WHERE assignmentid=$1 AND $2=ANY(users)", assignment, user)
	if err!=nil {
		fmt.Println(err)
	}
	defer rows.Close()

	var resp AssignmentResponse
	fmt.Println("rows: ", rows)
	exists := false

	for rows.Next() {
		var asid int
		var content string
		var users []string
		var date time.Time
		rows.Scan(&asid, (*pq.StringArray)(&users), &content, &date)
		fmt.Println("scanned user: ", users)
		fmt.Println("scanned content: ", content)
		fmt.Println("date: ", date)
		fmt.Println("asid: ", asid)
		resp = AssignmentResponse{asid, users, content, date.Format(time.RFC3339)}
		exists = true
	}
	fmt.Println("exists: ", exists)

	if !exists {
		fmt.Println("nonexistent")
		iaf := InvalidAssignmentFetch{"iaf"}
		return c.JSON(iaf)
	}

	return c.JSON(resp)
}

func UpdateAssignmentResponse(c *fiber.Ctx, db *sql.DB) error {
	newRes := AssignmentResponse{}
	if err := c.BodyParser(&newRes); err!=nil {
		fmt.Println(err)
	}
	fmt.Println("creating assignment...")
	fmt.Println(newRes.Assignmentid)

	date := time.Now()

	_, err := db.Exec("UPDATE assignmentresponse SET content=$3, duedate=$4 WHERE assignmentid=$1 AND users=$2", newRes.Assignmentid, pq.Array(newRes.Users), newRes.Content, date)
	if err!=nil {fmt.Println(err)}
	return c.JSON(newRes)
}
package handlers

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"fmt"
	"time"
	"sort"
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
	User string
	Content string
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

	_, err := db.Exec("INSERT INTO assignmentresponse (assignmentid, user, content) VALUES ($1, $2, $3)", newRes.Assignmentid, newRes.User, newRes.Content)
	if err!=nil {fmt.Println(err)}
	return c.JSON(newRes)
}

func GetAssignmentResponses(c *fiber.Ctx, db *sql.DB) error {
	assignment := c.Query("assignment")
	rows, err := db.Query("SELECT (assignmentid, user, content) FROM assignmentresponse WHERE assignmentid=$1", assignment)
	if err!=nil {
		fmt.Println(err)
	}
	var resp []AssignmentResponse
	for rows.Next() {
		var asid int
		var user, content string
		rows.Scan(&asid, &user, &content)
		r := AssignmentResponse{asid, user, content}
		resp = append(resp, r)
	}

	return c.JSON(resp)
}
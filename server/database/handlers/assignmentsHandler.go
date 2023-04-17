package handlers

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"fmt"
	"time"
)

type Assignment struct {
	Classroomid int
	Title string
	Descr string
	Duedate string
}

type AssignmentResponse struct {
	Assignmentid int
	User string
	Content string
}

func CreateAssignment(c *fiber.Ctx, db *sql.DB) error {
	newAssignment := Assignment{}
	if err := c.BodyParser(&newAssignment); err!=nil {
		fmt.Println(err)
	}

	fmt.Println("creating assignment!")
	date, _ := time.Parse("2006-01-02T15:04:05.000Z", newAssignment.Duedate)

	fmt.Println("date: ", date)

	_, err := db.Exec("INSERT INTO assignments (classroomid, title, descr, duedate) VALUES ($1, $2, $3, $4)", newAssignment.Classroomid, newAssignment.Title, newAssignment.Descr, date)
	if err!=nil {
		fmt.Println(err)
	}
	return c.JSON(newAssignment)
}

func GetAssignmentsForClass(c *fiber.Ctx, db *sql.DB) error {
	class := c.Query("class")
	rows, err := db.Query("SELECT classroomid, title, descr, duedate FROM assignments WHERE classroomid=$1", class)
	if err!=nil {
		fmt.Println(err)
	}
	
	var assignments []Assignment

	for rows.Next() {
		var classroomid int
		var title, descr string
		var duedate time.Time
		rows.Scan(&classroomid, &title, &descr, &duedate)
		fmt.Println("title: ", title)
		fmt.Println("duedate: ", duedate)
		as := Assignment{classroomid, title, descr, duedate.Format(time.RFC3339)}
		assignments = append(assignments, as)
	}

	if len(assignments)==0 {
		return c.JSON(make([]Assignment, 0))
	}

	return c.JSON(assignments)
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
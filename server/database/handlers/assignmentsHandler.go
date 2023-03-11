package handlers

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"fmt"
)

type Assignment struct {
	Classroomid int
	Title string
	Desc string
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
	_, err := db.Exec("INSERT INTO assignments (classsroomid, title, desc) VALUES ($1, $2, $3)", newAssignment.Classroomid, newAssignment.Title, newAssignment.Desc)
	if err!=nil {
		fmt.Println(err)
	}
	return c.JSON(newAssignment)
}

func GetAssignmentsForClass(c *fiber.Ctx, db *sql.DB) error {
	class := c.Query("class")
	rows, err := db.Query("SELECT (classroomid, title, desc) FROM assignments WHERE classroomid=$1", class)
	if err!=nil {
		fmt.Println(err)
	}
	
	var assignments []Assignment

	for rows.Next() {
		var cid int
		var title, desc string
		rows.Scan(&cid, &title, &desc)
		as := Assignment{cid, title, desc}
		assignments = append(assignments, as)
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
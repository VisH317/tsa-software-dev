package main

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
)

type Student struct {
	student string
	class string
}

// accepts student ID (from mongodb) and class ID and appends to array of students for class
func addStudent(c *fiber.Ctx, db *sql.DB) error {
	student := Student{}
	if err := c.BodyParser(&student); err!=nil {
		c.SendString(err.Error())
	}

	_, err := db.Exec("update classes set students = array_append(students, $1) where id =$2", student.student, student.class)
	if err!=nil {
		c.SendString(err.Error())
	}

	return c.Redirect("/")
}

func deleteStudent(c *fiber.Ctx, db *sql.DB) error {
	student := Student{}
	if err := c.BodyParser(&student); err!=nil {
		c.SendString("error parsing request body")
	}

	_, err := db.Exec("update classes set students = array_remove(students, $1) where id = $2", student.student, student.class)
	if err!=nil {
		c.SendString("db error")
	}

	return c.Redirect("/")
}
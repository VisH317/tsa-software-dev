package handlers

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type Student struct {
	Stud string
	Class int
}

// accepts student ID (from mongodb) and class ID and appends to array of students for class
func AddStudent(c *fiber.Ctx, db *sql.DB) error {
	student := Student{}
	if err := c.BodyParser(&student); err!=nil {
		c.SendString(err.Error())
	}
	fmt.Println(student.Stud)
	fmt.Println(student.Class)
	_, err := db.Exec("UPDATE classes SET students = ARRAY_APPEND(students, $1) where id = $2;", student.Stud, student.Class)
	if err!=nil {
		c.SendString(err.Error())
	}

	return c.Redirect("/")
}

func DeleteStudent(c *fiber.Ctx, db *sql.DB) error {
	student := c.Query("student")
	class := c.Query("class")
	fmt.Println("deleting student!! ", student, ", ", class)

	_, err := db.Exec("UPDATE classes SET students = array_remove(students, $1) where id = $2", student, class)
	if err!=nil {
		c.SendString("db error")
	}

	return c.Redirect("/")
}
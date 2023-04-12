package handlers

import (
	// "github.com/VisH317/db/models"
	//"log"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"fmt"
)

type Classroom struct {
	Id int
	Nm string
	Teacher string
	Students[] string
	// materials[] Material
	// assignments[] Assignment
	// lectures[] Lecture
	// tests[] Test
}

// create a class: requires the class name, teacher user id, and student user ids (pass as empty string if nothing)
func CreateClass(c *fiber.Ctx, db *sql.DB) error {
	newClass := Classroom{}
	if err:=c.BodyParser(&newClass); err!=nil {
		return c.SendString(err.Error())
	}
	// later: check for empty students and insert empty array automatically
	_, err := db.Exec("INSERT into classes (nm, teacher, students) VALUES($1, $2, $3)", newClass.Nm, newClass.Teacher, pq.Array(newClass.Students))
	if err!=nil {c.SendString(err.Error())}
	
	return c.Redirect("/")
}

func GetClasses(c *fiber.Ctx, db *sql.DB) error {
	user := c.Query("user")
	rows, err := db.Query("SELECT id, nm, teacher, students FROM classes WHERE teacher=$1", user)
	if err!=nil {
		return c.SendString("error fetching query")
	}
	defer rows.Close()

	var classes []Classroom

	for rows.Next() {
		var nm string
		var id int
		var teacher string
		var students []string
		rows.Scan(&id, &nm, &teacher, (*pq.StringArray)(&students))
		cl := Classroom{id, nm, teacher, students}
		classes = append(classes, cl)
	}

	if len(classes)==0 {
		return c.JSON(make([]Classroom, 0))
	}

	return c.JSON(classes)
}

func GetClassesForStudent(c *fiber.Ctx, db *sql.DB) error {
	email := c.Query("email")
	rows, err := db.Query("SELECT id, nm, teacher, students FROM classes WHERE $1 = ANY(students)", email)
	if err!=nil {
		fmt.Println(err)
	}

	var classes[] Classroom

	for rows.Next() {
		var id int
		var nm string
		var teacher string
		var students []string
		rows.Scan(&id, &nm, &teacher, (*pq.StringArray)(&students))
		fmt.Println("students: ", students)
		c := Classroom{id, nm, teacher, students}
		classes = append(classes, c)
	}

	if len(classes)==0 {
		return c.JSON(make([]Classroom, 0))
	}

	return c.JSON(classes)
}

func GetClassByID(c *fiber.Ctx, db *sql.DB) error {
	id := c.Query("id")
	rows, err := db.Query("SELECT id, nm, teacher, students FROM classes WHERE id=$1", id)
	if err!=nil {
		fmt.Println(err)
	}
	fmt.Println("newid: ", id)

	var class Classroom

	for rows.Next() {
		var id int
		var nm string
		var teacher string
		var students []string
		rows.Scan(&id, &nm, &teacher, (*pq.StringArray)(&students))
		fmt.Println(students)
		class = Classroom{id, nm, teacher, students}
	}

	return c.JSON(class)
}

type DeleteRes struct {
	IsSuccess bool
}

// delete a class - requires to pass a query string named class that has the class id from the database
func DeleteClass(c *fiber.Ctx, db *sql.DB) error {
	class := c.Query("class")
	fmt.Println("Deleting: ", class)
	db.Exec("DELETE FROM classes WHERE id=$1", class)
	res := DeleteRes{true}
	return c.JSON(res)
}
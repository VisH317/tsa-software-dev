package main

import (
	// "github.com/VisH317/db/models"
	//"log"
	"database/sql"
	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"fmt"
)

type Classroom struct {
	Nm string
	Teachers string
	Students[] string
	// materials[] Material
	// assignments[] Assignment
	// lectures[] Lecture
	// tests[] Test
}

// create a class: requires the class name, teacher user id, and student user ids (pass as empty string if nothing)
func createClass(c *fiber.Ctx, db *sql.DB) error {
	newClass := Classroom{}
	if err:=c.BodyParser(&newClass); err!=nil {
		return c.SendString(err.Error())
	}
	fmt.Println("name: ",newClass.Nm)
	fmt.Println("teachers: ",newClass.Teachers)
	fmt.Println(newClass.Students)
	// later: check for empty students and insert empty array automatically
	_, err := db.Exec("INSERT into classes VALUES($1, $2, $3)", newClass.Nm, newClass.Teachers, pq.Array(newClass.Students))
	if err!=nil {c.SendString(err.Error())}
	
	return c.Redirect("/")
}

func getClasses(c *fiber.Ctx, db *sql.DB) error {
	user := c.Query("user")
	rows, err := db.Query("SELECT * FROM classes WHERE teacher=$1", user)
	defer rows.Close()
	if err!=nil {
		return c.SendString("error fetching query")
	}

	var classes[] Classroom

	for rows.Next() {
		var cl Classroom
		rows.Scan(&cl)
		classes = append(classes, cl)
	}

	return c.JSON(classes)
}

// delete a class - requires to pass a query string named class that has the class id from the database
func deleteClass(c *fiber.Ctx, db *sql.DB) error {
	class := c.Query("class")
	db.Exec("DELETE FROM classes WHERE id=$1", class)
	return c.Redirect("/")
}
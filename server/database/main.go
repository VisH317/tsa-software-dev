package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

// setup db connection string
var connStr = "postgresql://postgres:password@localhost:5432/classroom?sslmode=disable"


func main() {
	app := fiber.New()

	// connect to db
	db, err := sql.Open("postgres", connStr)
	if err!=nil {
		log.Fatal(err)
	}

	// test route
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("hello")
	})

	// classroom CRUD routes
	app.Post("/api/classes", func(c *fiber.Ctx) error {
		return createClass(c, db)
	})

	app.Get("/api/classes", func(c *fiber.Ctx) error {
		return getClasses(c, db)
	})

	app.Delete("/api/classes", func(c *fiber.Ctx) error {
		return deleteClass(c, db)
	})

	// student update routes
	app.Post("/api/classes/students", func(c *fiber.Ctx) error {
		return addStudent(c, db)
	})

	app.Delete("/api/classes/students", func(c *fiber.Ctx) error {
		return deleteStudent(c, db)
	})

	port :=  os.Getenv("PORT")
	if port=="" {
		port="3000"
	}
	log.Fatalln(app.Listen(fmt.Sprintf(":%v", port)))
}
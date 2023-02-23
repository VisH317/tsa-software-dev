package main

import (
	"database/sql"
	"github.com/lib/pq"
	"fmt"
	"log"
	"os"
	"github.com/gofiber/fiber/v2"
)

// setup db connection string
var connStr = "postgresql://<username to be configured>:<pw to be configured>@localhost:5432/classroom"


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

	port :=  os.Getenv("PORT")
	if port=="" {
		port="3000"
	}
	log.Fatalln(app.Listen(fmt.Sprintf(":%v", port)))
}
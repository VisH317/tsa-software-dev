package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	handlers "github.com/VisH317/db/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	_"github.com/gofiber/fiber/v2/middleware/cache"
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

	// middleware

	app.Use(limiter.New(limiter.Config{
		LimiterMiddleware: limiter.SlidingWindow{},
		Max: 20,
		Expiration: 3* time.Second,
		LimitReached: func (c *fiber.Ctx) error {
			return c.SendString("exceeded rate limit")
		},
	}))

	// app.Use(cache.New(cache.Config{
	// 	Expiration: 30 * time.Minute,
	// 	CacheControl: true,
	// }))
	
	// test route
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("hello")
	})
	// classroom CRUD routes
	app.Post("/api/classes", func(c *fiber.Ctx) error {
		return handlers.CreateClass(c, db)
	})

	app.Get("/api/classes", func(c *fiber.Ctx) error {
		return handlers.GetClasses(c, db)
	})

	app.Delete("/api/classes", func(c *fiber.Ctx) error {
		return handlers.DeleteClass(c, db)
	})

	app.Get("api/classes/id", func(c *fiber.Ctx) error {
		return handlers.GetClassByID(c, db)
	})

	app.Get("api/classes/bystud", func(c *fiber.Ctx) error {
		return handlers.GetClassesForStudent(c, db)
	})

	// student update routes
	app.Post("/api/classes/students", func(c *fiber.Ctx) error {
		return handlers.AddStudent(c, db)
	})

	app.Delete("/api/classes/students", func(c *fiber.Ctx) error {
		return handlers.DeleteStudent(c, db)
	})

	// lecture routes
	app.Post("/api/lectures", func(c *fiber.Ctx) error {
		return handlers.CreateLecture(c, db)
	})

	app.Get("/api/lectures", func(c *fiber.Ctx) error {
		return handlers.GetLectureByID(c, db)
	})

	app.Delete("/api/lectures", func(c *fiber.Ctx) error {
		return handlers.DeleteLecture(c, db)
	})

	app.Post("/api/lectures/start", func(c *fiber.Ctx) error {
		return handlers.ToggleLectureStarted(c, db)
	})

	// notes routes
	app.Post("/api/notes", func(c *fiber.Ctx) error {
		return handlers.CreateNote(c, db)
	})

	app.Get("/api/notes", func(c *fiber.Ctx) error {
		return handlers.GetNote(c, db)
	})

	//assignment routes
	app.Post("/api/assignments", func(c *fiber.Ctx) error {
		return handlers.CreateAssignment(c, db)
	})

	app.Get("/api/assignments", func(c *fiber.Ctx) error {
		return handlers.GetAssignmentsForClass(c, db)
	})

	app.Post("/api/responses", func (c *fiber.Ctx) error {
		return handlers.CreateAssignmentResponse(c, db)
	})

	app.Get("/api/responses", func (c *fiber.Ctx) error {
		return handlers.GetAssignmentResponses(c, db)
	})

	port :=  os.Getenv("PORT")
	if port=="" {
		port="5001"
	}
	log.Fatalln(app.Listen(fmt.Sprintf(":%v", port)))
}
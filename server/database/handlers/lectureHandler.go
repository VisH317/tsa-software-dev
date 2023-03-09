package handlers

import (
	"database/sql"
	"github.com/gofiber/fiber/v2"
	_"github.com/lib/pq"
	"fmt"
)

type Lecture struct {
	Id int
	ClassID int
	Name string
	Description string
	Isstopped bool
}

func CreateLecture(c *fiber.Ctx, db *sql.DB) error {
	newLecture := Lecture{}
	if err := c.BodyParser(&newLecture); err != nil {
		fmt.Println(err)
	}

	newLecture.Isstopped = false

	_, err := db.Exec("INSERT INTO lectures (classID, name, description, isstopped) VALUES ($1, $2, $3, $4)", newLecture.ClassID, newLecture.Name, newLecture.Description, newLecture.Isstopped)
	if err!=nil {
		fmt.Println(err)
	}

	return c.Redirect("/")
}

func GetLectureByID(c *fiber.Ctx, db *sql.DB) error {
	id := c.Params("id", "")
	if id=="" {
		class := c.Query("class", "")
		if class=="" {fmt.Println("Something went wrong")}

		rows, err := db.Query("SELECT id, classID, name, description, isstopped FROM lectures WHERE classid=$1", class)
		if err!=nil {
			fmt.Println(err)
		}

		var lectures []Lecture

		for rows.Next() {
			var id int
			var classID int
			var name string
			var description string
			var isStopped bool
			rows.Scan(&id, &classID, &name, &description, &isStopped)
			l := Lecture{id, classID, name, description, isStopped}
			lectures = append(lectures, l)
		}

		return c.JSON(lectures)
	} else {
		rows, err := db.Query("SELECT id, classID, name, description FROM lectures WHERE id=$1", id)
		if err!=nil {
			fmt.Println(err)
		}
		var lectures []Lecture

		for rows.Next() {
			var id int
			var classID int
			var name string
			var description string
			var isStopped bool
			rows.Scan(&id, &classID, &name, &description, &isStopped)
			l := Lecture{id, classID, name, description, isStopped}
			lectures = append(lectures, l)
		}

		return c.JSON(lectures[0])
	}
}
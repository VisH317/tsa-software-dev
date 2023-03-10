package handlers

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
)

type Lecture struct {
	Id           int
	ClassID      int
	Name         string
	Description  string
	Isstopped    bool
	creationDate time.Time
}

type CreateLectureOutput struct {
	LectureID int
}

func CreateLecture(c *fiber.Ctx, db *sql.DB) error {
	newLecture := Lecture{}
	if err := c.BodyParser(&newLecture); err != nil {
		fmt.Println(err)
	}

	newLecture.Isstopped = false

	_, err := db.Exec("INSERT INTO lectures (classID, name, description, isstopped) VALUES ($1, $2, $3, $4)", newLecture.ClassID, newLecture.Name, newLecture.Description, newLecture.Isstopped)
	if err != nil {
		fmt.Println(err)
	}

	rows, err := db.Query("SELECT classID FROM lectures WHERE classid=$1 ORDER BY creationdate DESC", newLecture.ClassID)
	if err != nil {
		fmt.Println(err)
	}

	var lectureID int

	rows.Next()
	rows.Scan(&lectureID)
	ret := CreateLectureOutput{lectureID}

	return c.JSON(ret)
}

func GetLectureByID(c *fiber.Ctx, db *sql.DB) error {
	id := c.Query("id", "")
	fmt.Println("id: ", id)
	if id == "" {
		class := c.Query("class", "brh")
		fmt.Println("class: ", class)
		if class == "" {
			fmt.Println("Something went wrong")
		}

		rows, err := db.Query("SELECT id, classID, name, description, isstopped, creationdate FROM lectures WHERE classid=$1", class)
		if err != nil {
			fmt.Println("brh")
			fmt.Println(err)
		}

		var lectures []Lecture

		for rows.Next() {
			var id int
			var classID int
			var name string
			var description string
			var isStopped bool
			var creationDate time.Time
			rows.Scan(&id, &classID, &name, &description, &isStopped, &creationDate)
			l := Lecture{id, classID, name, description, isStopped, creationDate}
			lectures = append(lectures, l)
		}

		if len(lectures)==0 {
			return c.SendString("nothing")
		}
		return c.JSON(lectures)
	} else {
		rows, err := db.Query("SELECT id, classID, name, description, isstopped, creationdate FROM lectures WHERE id=$1", id)
		if err != nil {
			fmt.Println("classes")
			fmt.Println(err)
		}
		var lectures []Lecture

		for rows.Next() {
			var id int
			var classID int
			var name string
			var description string
			var isStopped bool
			var creationDate time.Time
			rows.Scan(&id, &classID, &name, &description, &isStopped, &creationDate)
			l := Lecture{id, classID, name, description, isStopped, creationDate}
			lectures = append(lectures, l)
		}

		fmt.Println("Lectures: ",lectures)

		if len(lectures)==0 {
			return c.SendString("nothing")
		}
		return c.JSON(lectures)
	}
}

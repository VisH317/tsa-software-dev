package handlers

import (
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v2"
)

type Note struct {
	Id int
	LectureID int
	StudentEmail string
	Title string
	Content string
}

func CreateNote(c *fiber.Ctx, db *sql.DB) error {
	newNote := Note{}
	if err := c.BodyParser(&newNote); err!=nil {
		fmt.Println(err)
	}

	fmt.Println("newnote: ",newNote)

	_, err := db.Exec("INSERT INTO notes (lectureID, studentEmail, title, content) VALUES ($1, $2, $3, $4)", newNote.LectureID, newNote.StudentEmail, newNote.Title, newNote.Content)
	if err!=nil {
		fmt.Println(err)
	}

	return c.SendString("success")
}

func GetNote(c *fiber.Ctx, db *sql.DB) error {
	lectureID := c.Query("lectureid", "")

	if lectureID=="" {
		fmt.Println("messed up")
	}

	studentEmail := c.Query("studentemail", "")
	if studentEmail!="" {
		rows, err := db.Query("SELECT (id, lectureID, studentemail, title, content) FROM notes WHERE lectureid=$1 AND studentemail=$2", lectureID, studentEmail)
		if err!=nil {
			fmt.Println(err)
		}

		var notes []Note
		for rows.Next() {
			var id int
			var lectureid int
			var studentemail string
			var title string
			var content string
			rows.Scan(&id, &lectureid, &studentemail, &title, &content)
			n := Note{id, lectureid, studentemail, title, content}
			notes = append(notes, n)
		}

		if len(notes)==0 {
			return c.SendString("nothing")
		}
		return c.JSON(notes[0])
	}

	rows, err := db.Query("SELECT (id, lectureID, studentemail, title, content) FROM notes WHERE lectureid=$1", lectureID)
	if err!=nil {
		fmt.Println(err)
	}

	var notes []Note
	for rows.Next() {
		var id int
		var lectureid int
		var studentemail string
		var title string
		var content string
		rows.Scan(&id, &lectureid, &studentemail, &title, &content)
		n := Note{id, lectureid, studentemail, title, content}
		notes = append(notes, n)
	}

	if len(notes)==0 {
		c.SendString("nothing")
	}
	return c.JSON(notes)
}
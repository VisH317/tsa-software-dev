package models

type Material struct {
	name string
	desc string
	comments[] Comment
}

type Assignment struct {
	name string
	desc string
	submissions[] AssignmentSubmission
	comments[] Comment
}

type AssignmentSubmission struct {
	uid int
	names[] string
	blobUrl string
}

type Lecture struct {
	name string
	matBlobUrl string
	studentNotes[] Note
}

type Note struct {
	uid int
	name string
	blobUrl string
}

type Test struct {
	name string
}

type Comment struct {
	uid int
	name int
	time int
	text string
}
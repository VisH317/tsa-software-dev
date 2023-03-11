### Database Schema Description

**Required Documents:**
 * Classrooms - contain teachers, students, assignments, 
 * Students - includes account ref, possibly points (if we want to make a points system for the google classroom as a motivation)
 * Teachers - account ref
 * Assignments:
   * Material: contains title, text, comments
     * Comments: user ref and text
   * Lecture: stores name and notes for each student (later include dates and monitoring statistics)
   * Classwork/Homework: title, text, files, due date, attaching files for each person
   * Test: student records and progress (preferably websocket updated for monitoring and later pushed to a database)
   * Group assignment: groups list, title, text, files for each

_IMPORTANT:_ we're going to need a blob store to save the files sent by each (for now we will just do PDFs, Images, etc. for assignments)

**Documents Summary:**
 * Classrooms document
 * Materials, work, tests, groups
 * Lectures - with recorded notes from students to be saved


**Implementation:**
 * Language to use: Go because its cool and insane speeds as well as easy support and package management and I want to try something new :)
 * Libraries:
   * Gin: HTTP server for Go, extremely fast (tests show 7x faster than express and 14x faster than Flask, a bit of a learning curve tho)
   * Go PQ or Go MongoDB driver depending on which database we choose to use

**Database Provider Options:**
 * Google classroom uses BigTable (similar to MongoDB bc its document oriented)
 * Probably we will stick to MongoDB just because of the difficulty of organizing this crazy amount of data as well as blob store links
 * Other options to look into
 * Postgres: always a solid option and the read and write consistency will be helpful 

**Routes:**
 * Create, read, delete classrooms
   * Get all classrooms for teacher and for student
   * Add/remove students from classroom
   * Create, read lectures
     * Add note to lecture (once submitted by student)

**Extra things if we are very extra:**
 * Rate limiters pog
 * Load balancer with channels
 * OpenAPI spec
 * logging lmao
**GET CLASSES:** curl http://localhost:3000/api/classes?user=teacher@email.com
**POST CLASSES:** curl -H 'Content-Type: application/json' -d '{"nm": "class", "teacher": "teacher@email.com", "students": []}' -X POST http://localhost:3000/api/classes
**DELETE CLASSES:** curl http://localhost:3000/api/classes?class=1 -X DELETE
**ADD USER:** curl http://localhost:3000/api/classes/students -H 'Content-Type: application/json' -d '{"stud": "bruh", "class": "1"}' -X POST
**DELETE USER:** curl http://localhost:3000/api/classes/students -H 'Content-Type: application/json' -d '{"stud": "bruh", "class": 1}' -X DELETE

**CREATE LECTURE:** curl http://localhost:3000/api/lectures -X POST -H 'Content-Type: application/json' -d '{"ClassID": 1, "Name": "bruh", "Description": "bruh moment lecture"}'
**GET LECTURE BY ID:** curl http://localhost:3000/api/lectures?id=1
**GET LECTURE BY CLASS ID:** curl http://localhost:3000/api/lectures?class=1

**CREATE NOTE:** curl http://localhost:3000/api/notes -X POST -H 'Content-Type: application/json' -d '{"LectureID": 1, "StudentEmail": "student@email.com", "Title": "notes for lecture", "Content": "imagine taking notes lol"}'
**GET NOTE BY LECTURE ID:** curl http://localhost:3000/api/notes?lectureid=1
**GET NOTE BY LECTURE ID & STUDENT EMAIL:** curl http://localhost:3000/api/notes?lectureid=1&?studentemail=student@email.com
**GET CLASSES:** curl http://localhost:3000/api/classes?user=teacher@email.com
**POST CLASSES:** curl -H 'Content-Type: application/json' -d '{"nm": "class", "teachers": "teacher@email.com", "students": []}' -X POST http://localhost:3000/api/classes
**DELETE CLASSES:** curl http://localhost:3000/api/classes?class=1 -X DELETE
**ADD USER:** curl http://localhost:3000/api/classes/students/add -H 'Content-Type: application/json' -d '{"stud": "bruh", "class": "1"}' -X POST
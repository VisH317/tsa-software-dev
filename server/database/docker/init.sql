\c classroom;

-- CREATE USER classroom;
-- CREATE DATABASE IF NOT EXISTS classroom;
-- GRANT ALL PRIVILEGES ON DATABASE classroom TO classroom;


-- GRANT ALL ON SCHEMA public TO public;

create table classes (
    id serial primary key,
    nm text,
    teacher text,
    students text[]
);

-- create table students (
--     id serial primary key,
--     email text,
--     teacher text[],
--     student
-- );

-- MATERIALS FOR EACH CLASS

-- create table MATERIALS if not exists (

-- )

-- create table ASSIGNMENTS if not exists (

-- )

create table lectures (
    id serial primary key,
    classid INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    isstopped BOOLEAN,
    --materialURL text,
    creationdate DATE NOT NULL DEFAULT CURRENT_DATE,
    foreign key (classid) references classes(id)
);

create table notes (
    id serial primary key,
    lectureid int NOT NULL,
    studentemail text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    foreign key (lectureid) references lectures(id)
);

create table assignments (
    id serial primary key,
    classroomid int NOT NULL,
    title text NOT NULL,
    descr text NOT NULL,
    duedate timestamp NOT NULL,
    maxgroup int NOT NULL,
    foreign key (classroomid) references classes(id)
);

create table assignmentresponse (
    id serial primary key,
    assignmentid int NOT NULL,
    users text[] NOT NULL,
    content text NOT NULL,
    duedate timestamp NOT NULL,
    foreign key (assignmentid) references assignments(id)
);

-- create table TESTS if not exists (
    
-- )
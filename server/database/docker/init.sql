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
    foreign key (classID) references classes(id)
);

create table notes (
    id serial primary key,
    lectureid int,
    studentemail text,
    title text,
    content text,
    foreign key (lectureID) references lectures(id)
);

-- create table TESTS if not exists (
    
-- )
\c classroom;

-- CREATE USER classroom;
-- CREATE DATABSE IF NOT EXISTS classroom;
-- GRANT ALL PRIVILEGES ON DATABASE classroom TO classroom;


-- GRANT ALL ON SCHEMA public TO public;



create table classes if not exists (
    id serial primary key,
    name varchar(255),
    teacher varchar(255),
    students text[],
);

-- MATERIALS FOR EACH CLASS

-- create table MATERIALS if not exists (

-- )

-- create table ASSIGNMENTS if not exists (

-- )

-- create table lectures if not exists (
--     id serial primary key,
--     classID int,
--     name varchar(255),
--     description text,
--     materialURL text,
--     foreign key (classID) references classes(id)
-- );

-- create table notes if not exists (
--     id serial primary key,
--     lectureID int,
--     title varchar(255),
--     content text,
--     foreign key (lectureID) references lectures(id)
-- );

-- create table TESTS if not exists (
    
-- )
export interface Classroom {
    id: number,
    nm: string,
    teacher: string,
    students: string[]
}

export interface Lecture {
    teacher: string,
    studentCount: number,
    socketID: string,
}

export interface LecturePersist {
    classID: number,
    name: string,
    description: string
}

export interface Note {
    lectureID: number,
    studentEmail: string,
    title: string,
    content: string
}
export interface Classroom {
    id: number,
    nm: string,
    teacher: string,
    students: string[]
}

export interface Lecture {
    teacher: string,
    studentCount: number,
    socketID: string
}

export interface ServerToClientEvents {
    // room management & error events
    roomClosed: () => void
    unauthorized: () => void

    // notifications for people joining and leaving rooms
    studentJoins: (students: number) => void
    studentLeaves: (students: number) => void
    
    // sends question to student client
    receiveTeacherQuestion: (questionPrompt: string) => void
    // sends question responses from students to teacher client
    sendTeacherQuestionResponse: (email: string, questionAnwer: string, question: string) => void

    // sends question asked by student to teacher socket ID
    receiveStudentQuestion: (email: string, questionPrompt: string, socketID: string) => void
    // sends student question response from teacher back to student
    sendStudentQuestionResponse: (questionAnswer: string, question: string) => void

    // receiving teacher message
    receiveTeacherMessage: (message: string) => void

    sendDisturbance: (email: string) => void
    sendJoin: (email: string) => void
}

export interface ClientToServerEvents {
    // room management
    createRoom: (userEmail: string, lectureID: number, classroomID: number) => void
    deleteRoom: (userEmail: string, lectureID: number) => void
    joinRoom: (userEmail: string, lectureID: number) => void
    leaveRoom: (userEmail: string, lectureID: number, title: string, content: string) => void

    // teacher questions
    createTeacherQuestion: (userEmail: string, lectureID: number, questionPrompt: string) => void
    answerTeacherQuestion: (userEmail: string, lectureID: number, questionAnswer: string, question: string) => void

    // student questions
    createStudentQuestion: (userEmail: string, lectureID: number, questionPrompt: string) => void
    answerStudentQuestion: (userEmail: string, lectureID: number, questionAnswer: string, socketID: string, question: string) => void

    // sending teacher message
    sendTeacherMessage: (userEmail: string, lectureID: number, message: string) => void

    // disturbance detection
    checkDisturbance: (userEmail: string, lectureID: number) => void
}

export interface InterServerEvents {}

export interface SocketData {}
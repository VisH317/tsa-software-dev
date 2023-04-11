export interface ServerToClientEvents {
    // room management & error events
    roomClosed: () => void
    unauthorized: () => void
    
    // sends question to student client
    receiveTeacherQuestion: (questionPrompt: string) => void
    // sends question responses from students to teacher client
    sendTeacherQuestionResponse: (questionAnwer: string) => void

    // sends question asked by student to teacher socket ID
    receiveStudentQuestion: (questionPrompt: string, socketID: string) => void
    // sends student question response from teacher back to student
    sendStudentQuestionResponse: (questionAnswer: string) => void

    sendDisturbance: () => void
}

export interface ClientToServerEvents {
    // room management
    createRoom: (userEmail: string, lectureID: number, classroomID: number) => void
    deleteRoom: (userEmail: string, lectureID: number) => void
    joinRoom: (userEmail: string, lectureID: number) => void
    leaveRoom: (userEmail: string, lectureID: number, title: string, content: string) => void

    // teacher questions
    createTeacherQuestion: (userEmail: string, lectureID: number, questionPrompt: string) => void
    answerTeacherQuestion: (userEmail: string, lectureID: number, questionAnswer: string) => void

    // student questions
    createStudentQuestion: (userEmail: string, lectureID: number, questionPrompt: string) => void
    answerStudentQuestion: (userEmail: string, lectureID: number, questionAnswer: string, socketID: string) => void

    // disturbance detection
    checkDisturbance: (userEmail: string, lectureID: number) => void
}

export interface InterServerEvents {}

export interface SocketData {}
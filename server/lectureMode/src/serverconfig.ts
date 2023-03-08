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
    createRoom: (userEmail: string, classroomID: string) => void
    deleteRoom: (userEmail: string, classroomID: string) => void
    joinRoom: (userEmail: string, classroomID: string) => void
    leaveRoom: (userEmail: string, classroomID: string, notes: string) => void

    // teacher questions
    createTeacherQuestion: (userEmail: string, classroomID: string, questionPrompt: string) => void
    answerTeacherQuestion: (userEmail: string, classroomID, string, questionAnswer: string) => void

    // student questions
    createStudentQuestion: (userEmail: string, classroomID: string, questionPrompt: string) => void
    answerStudentQuestion: (userEmail: string, classroomID: string, questionAnswer: string, socketID: string) => void

    // disturbance detection
    checkDisturbance: (userEmail: string, classroomID: string) => void
}

export interface InterServerEvents {}

export interface SocketData {}
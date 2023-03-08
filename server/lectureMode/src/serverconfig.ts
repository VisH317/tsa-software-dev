export interface ServerToClientEvents {
    roomClosed: () => void,
    unauthorized: () => void
}

export interface ClientToServerEvents {
    // room management
    createRoom: (userEmail: string, classroomID: string) => void,
    deleteRoom: (userEmail: string, classroomID: string) => void,
    joinRoom: (userEmail: string, classroomID: string) => void,
    leaveRoom: (userEmail: string, classroomID: string, notes: string) => void,

    // teacher questions
    createTeacherQuestion: (userEmail: string, classroomID: string, questionPrompt: string) => void,
    answerTeacherQuestion: (userEmail: string, classroomID, string, questionAnswer: string) => void,

    // student questions
    createStudentQuestion: (userEmail: string, classroomID: string, questionPrompt: string) => void,
    answerStudentQuestion: (userEmail: string, classroomID: string, questionAnswer: string) => void
}

export interface InterServerEvents {}

export interface SocketData {}
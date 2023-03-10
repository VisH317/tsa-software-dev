export interface Test {
    name: string
    classroomID: number
    MCquestions: MCQuestion[]
    OpenEnded: OpenEndedQuestion[]
}

export interface MCQuestion {
    questionPrompt: string
    answers: string[]
    correct: number
}

export interface OpenEndedQuestion {
    questionPrompt: string
    answer: string
}
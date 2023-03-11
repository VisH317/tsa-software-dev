export interface Test {
    name: string
    classroomID: number
    MCquestions: MCQuestion[]
    OpenEnded: OpenEndedQuestion[]
}

export interface MCQuestion {
    questionId: number
    questionPrompt: string
    answers: string[]
    correct: number
}

export interface OpenEndedQuestion {
    questionId: number
    questionPrompt: string
    answer: string
}

export interface Response {
    MCquestions: MCQuestionResponse[]
    OpenEnded: OpenEndedQuestionResponse[]
}

export interface MCQuestionResponse {
    questionId: number
    response: number
}

export interface OpenEndedQuestionResponse {
    questionId: number
    response: string
}
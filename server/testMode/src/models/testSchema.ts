import mongoose, { Schema } from 'mongoose'

const testSchema: Schema = new Schema({
    name: String,
    classroomID: Number,
    mcQuestions: [{
        questionPrompt: String,
        answers: [{ type: String }],
        correctAnswer: Number
    }],
    openEndedQuestions: [{
        questionPrompt: String,
        answer: String
    }],
    started: { type: Boolean, default: false },
    finished: { type: Boolean, default: false },
    responses: [{
        MCQuestions: [{
            questionId: Number,
            response: Number
        }],
        OpenEndedQuestions: [{
            questionId: Number,
            response: String
        }]
    }]
})

mongoose.model("Test", testSchema)
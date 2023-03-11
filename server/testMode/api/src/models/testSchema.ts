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
    }]
})

mongoose.model("Test", testSchema)
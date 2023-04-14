import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture, StartLectureData } from '@/lib/classData'
import { useUser, Email } from '@/lib/user'
import Modal from '@/components/Modal/Modal'
import { createSocket } from 'dgram'

// IMPORTANT FOR LATER: add check for lecture being accessed is in the right class

export default function TeacherLecture() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [lec, setLec] = useState<Lecture>()
    const [students, setStudents] = useState<number>(0)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentModal, setCurrentModal] = useState<Question>()
    const [modal, setModal] = useState<boolean>(false)

    // fetch list of lectures with react-query
    const { status, data, error, isFetching } = useQuery({
        queryKey: ['teacherClasses', id],
        queryFn: async ({ queryKey }) => {
            const [_, cid] = queryKey
            console.log(cid)
            if(cid===undefined) return
            const res = await axios.get("/api/lectures", { params: { id: cid } })
            console.log(res)
            setLec(res.data)
            return res.data
        }
    })

    // connect websocket and joining/leaving functionality
    const socket = io("ws://localhost:8080", {
        transports: ["websocket"]
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on("studentJoins", num => setStudents(num))
    socket.on("studentLeaves", num => setStudents(num))

    // close 
    const closeRoom = async () => {
        if(user.state!=="hasData") return
        console.log("lectureID: ", lec?.Id)
        console.log("classid: ", lec?.ClassID)
        socket.emit("deleteRoom", user.data.email, lec?.Id)
        const req: StartLectureData = { lecture: lec?.Id!, start: true }
        const res = await axios.post("/api/lectures/start", req)
        router.push(`/teacher/${lec?.Id!}`)
    }

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        if(status==='success'&&user.state==="hasData") {
            socket.emit("createRoom", user.data.email, lec?.Id, lec?.ClassID)
        }
    }, [status, user.state])

    socket.on("receiveStudentQuestion", (email: Email, question: string, id: string): void => {
        const q: Question = { email, question, id }
        setQuestions([...questions, q])
    })

    const [answer, setAnswer] = useState<string>("")

    const openQuestionResponse = (q: Question) => {
        setCurrentModal(q)
        setModal(true)
    }

    // teacher responses to student questions
    const submitQuestionResponse = () => {
        socket.emit("answerStudentQuestion", currentModal?.email, lec?.Id, answer, currentModal?.id, currentModal?.question)
        // alert("submitted answer!!")
    }

    const mapQuestions = () => {
        return questions.map(q => (
            <div>
                <h4>{q.email}</h4>
                <p>Question: {q.question}</p>
                <button onClick={() => openQuestionResponse(q)}>Respond to Question</button>
            </div>
        ))
    }

    // creating teacher questions
    const [teacherQuestion, setTeacherQuestion] = useState<TeacherQuestion>({ question: "", answer: [] })
    const [allTeacherQuestions, setAllTeacherQuestions] = useState<TeacherQuestion[]>([]) // need a map, adding 
    const [currentTeacherQuestion, setCurrentTeacherQuestion] = useState<TeacherQuestion>()

    const createTeacherQuestion = (e: any) => {
        e.preventDefault()
        if(user.state!=="hasData") return
        console.log("teacherquestion: ", teacherQuestion)
        setAllTeacherQuestions([...allTeacherQuestions, teacherQuestion])
        console.log("allTeacherQuestions: ", allTeacherQuestions)
        socket.emit("createTeacherQuestion", user.data.email, lec?.Id, teacherQuestion.question)
        setTeacherQuestion({ question: "", answer: [] })
    }

    socket.on("sendTeacherQuestionResponse", (email, answer, question) => {
        const ans: Answer = { email, answer }
        console.log("allteacherquestions when getting response: ", allTeacherQuestions)
        const atq: TeacherQuestion[] = [...allTeacherQuestions]
        console.log("atq: ", atq)
        console.log("Question: ", question)
        const idx: number = atq.map(q => q.question).indexOf(question)
        console.log("idx: ", idx)
        atq[idx] = { question, answer: [...atq[idx].answer, ans] }
        setAllTeacherQuestions(atq)
    })

    const [openAnswers, setOpenAnswers] = useState<boolean>(false)

    const openAnswersModal = (q: TeacherQuestion) => {
        setCurrentTeacherQuestion(q)
        setOpenAnswers(true)
    }

    const mapTeacherQuestions = () => {
        console.log("mapTeacherQuestions: ", allTeacherQuestions)
        return allTeacherQuestions.map(q => (
            <div>
                <p>Question: {q.question}</p>
                <button onClick={() => openAnswersModal(q)}>See Answers</button>
            </div>
        ))
    }

    const mapAnswers = () => {
        return currentTeacherQuestion?.answer.map((a: Answer) => (
            <div>
                <h5>Email: {a.email}</h5>
                <p>Answer: {a.answer}</p>
            </div>
        ))
    }

    if(status==="loading") return <div>LOADING</div>
    if(status==='error') return <div>error</div>
    
    return (
        <>
            <p>{students}</p>
            <button onClick={closeRoom}>Close Room</button>
            <div>Questions from Students!!!!:
                {mapQuestions()}
            </div>
            <div>
                Ask a question to your students!!!!!
                <form onSubmit={createTeacherQuestion}>
                    <textarea value={teacherQuestion.question} placeholder="Question:" rows={3} cols={25} onChange={(e) => setTeacherQuestion({ question: e.target.value, answer: [] })}/>
                    <button type="submit">Ask Question</button>
                </form>
            </div>

            <div>
                see answers to previous questions:  
                {mapTeacherQuestions()}
            </div>

            <Modal open={modal} close={() => setModal(false)}>
                <form onSubmit={submitQuestionResponse}>
                    <h4>Submit your response</h4><br/>
                    <p>Question: {currentModal?.question}</p>
                    <textarea cols={3} rows={25} value={answer} onChange={e => setAnswer(e.target.value)}  placeholder="your answer:"/>
                    <button type="submit">Answer Question</button>
                </form>
            </Modal>
            <Modal open={openAnswers} close={() => setOpenAnswers(false)}>
                <h1>Question Answers</h1>
                <p>Question: {currentTeacherQuestion?.question}</p>
                {mapAnswers()}
            </Modal>
        </>
    )
    // NOTES: events to emit - createRoom, deleteRoom, for student: joinRoom leaveRoom (with notes UI)
    // render a list of people in the meeting and change when receiving a leave or join room

}

interface Question {
    email: Email
    question: string
    id: string
}

interface TeacherQuestion {
    question: string
    answer: Answer[]
}

interface Answer {
    answer: string
    email: Email
}
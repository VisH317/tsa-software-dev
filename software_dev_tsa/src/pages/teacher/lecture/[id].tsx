import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture, StartLectureData } from '@/lib/classData'
import { useUser, Email } from '@/lib/user'
import Modal from '@/components/Modal/Modal'
import { createSocket } from 'dgram'
import type { Socket } from 'socket.io-client'
import MiniDrawer from '@/components/Dashboard/Drawer'
import { montserrat } from '@/styles/fonts'

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
    const [message, setMessage] = useState<string[]>([])
    const ws = useRef<Socket>()

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

    useEffect(() => {
        const socket = io("ws://localhost:8080", {
            transports: ["websocket"]
        })

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on("studentJoins", num => setStudents(num))
        socket.on("studentLeaves", num => setStudents(num))

        socket.on("receiveStudentQuestion", (email: Email, question: string, id: string): void => {
            const q: Question = { email, question, id }
            setQuestions(questions => [...questions, q])
        })

        socket.on("sendTeacherQuestionResponse", (email: Email, answer: string, question: string) => { // can refactor into a useEffect callback if this doesnt work
            const ans: Answer = { email, answer }
            setAllTeacherQuestions(allTeacherQuestions => {
                const atq = [...allTeacherQuestions]
                console.log("atq: ", atq!)
                console.log("Question: ", question)
                const idx: number = atq!.map(q => q.question).indexOf(question)
                console.log("idx: ", idx)
                atq![idx] = { question, answer: [...atq![idx].answer, ans] }
                return atq
            })
        })

        socket.on("sendDisturbance", (email: string) => {
            setMessage(msg => [...msg, `${email} has left the session`])
        })
        
        socket.on("sendJoin", (email: string) => {
            setMessage(msg => [...msg, `${email} has joined the session`])
        })

        ws.current = socket

        return () => {
            if(user.state!=="hasData") return
            console.log("unmounting...")
            // socket.emit("deleteRoom", user.data.email, lec?.Id)
            socket.disconnect()
        }

    }, [])

    // connect websocket and joining/leaving functionality
    

    // close 
    const closeRoom = async () => {
        if(user.state!=="hasData") return
        console.log("lectureID: ", lec?.Id)
        console.log("classid: ", lec?.ClassID)
        ws.current?.emit("deleteRoom", user.data.email, lec?.Id)
        const req: StartLectureData = { lecture: lec?.Id!, start: true }
        const res = await axios.post("/api/lectures/start", req)
        router.push(`/teacher/${lec?.Id!}`)
    }

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        if(status==='success'&&user.state==="hasData") {
            ws.current?.emit("createRoom", user.data.email, lec?.Id, lec?.ClassID)
        }
    }, [status, user.state])

    

    const [answer, setAnswer] = useState<string>("")

    const openQuestionResponse = (q: Question) => {
        setCurrentModal(q)
        setModal(true)
    }

    // teacher responses to student questions
    const submitQuestionResponse = (e?:any) => {
        e?.preventDefault()
        ws.current?.emit("answerStudentQuestion", currentModal?.email, lec?.Id, answer, currentModal?.id, currentModal?.question)
        // alert("submitted answer!!")
    }

    const mapQuestions = () => {
        console.log("Questions: ", questions.length)
        return questions.map(q => (
            <div className="flex flex-row p-10 items-center w-full border-b-2 border-slate-200 gap-10 duration-150">
                <div className="grow flex flex-col gap-5">
                    <p className="text-lg text-slate-700 font-normal">Question: {q.question}</p>
                    <h4 className="text-md text-slate-400 font-light">From: {q.email}</h4>
                </div>
                <div className="flex-none w-[30%] flex justify-center items-center">
                    <button onClick={() => openQuestionResponse(q)} className="bg-green-500 px-3 rounded-lg py-3 text-white duration-300 hover:-translate-y-1 hover:bg-green-400 hover:shadow-lg">Respond to Question</button>
                </div>
            </div>
        ))
    }

    // creating teacher questions
    const [teacherQuestion, setTeacherQuestion] = useState<TeacherQuestion>({ question: "", answer: [] })
    const [allTeacherQuestions, setAllTeacherQuestions] = useState<TeacherQuestion[]>([]) // need a map, adding 
    const [currentTeacherQuestion, setCurrentTeacherQuestion] = useState<TeacherQuestion>()

    const createTeacherQuestion = (e?: any) => {
        e?.preventDefault()
        if(user.state!=="hasData") return
        console.log("teacherquestion: ", teacherQuestion)
        setAllTeacherQuestions(allTeacherQuestions => [...allTeacherQuestions, teacherQuestion])
        console.log("allTeacherQuestions: ", allTeacherQuestions)
        ws.current?.emit("createTeacherQuestion", user.data.email, lec?.Id, teacherQuestion.question)
        setTeacherQuestion({ question: "", answer: [] })
        setResponsesOpen(false)
    }

    const [openAnswers, setOpenAnswers] = useState<boolean>(false)

    const openAnswersModal = (q: TeacherQuestion) => {
        setCurrentTeacherQuestion(q)
        setOpenAnswers(true)
    }

    const mapTeacherQuestions = () => {
        console.log("mapTeacherQuestions: ", allTeacherQuestions)
        return allTeacherQuestions.map(q => (
            <div className="w-full border-b-2 border-slate-300">
                <div className="p-10 hover:bg-slate-300 duration-150 rounded-md flex flex-row ">
                    <div className="w-3/4 flex items-center"><p className="text-xl text-slate-600 font-light">{q.question}</p></div>
                    <div className="w-1/4 flex justify-center items-center"><button className="px-4 py-3 bg-green-500 text-md text-white font-medium rounded-lg duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-green-400" onClick={() => openAnswersModal(q)}>See Answers</button></div>
                </div>
            </div>
        ))
    }

    const mapAnswers = () => {
        return currentTeacherQuestion?.answer.map((a: Answer) => (
            <div className="w-full border-b-2 border-slate-100">
                <div className="w-full h-full flex gap-2 flex-col rounded-lg p-5 hover:bg-slate-100 duration-150">
                    <p><span className="font-medium">Answer:</span> {a.answer}</p>
                    <h5 className="text-xs text-right text-slate-400"><span className="font-medium">From:</span> {a.email}</h5>
                </div>
            </div>
        ))
    }

    const mapMessages = () => {
        return message.map(m => (
            <p>{m}</p>
        ))
    }

    // drawer props
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
    const openDrawer = () => setDrawerOpen(true)
    const closeDrawer = () => setDrawerOpen(false)

    // responses modal
    const [responsesOpen, setResponsesOpen] = useState<boolean>(false)

    // teacherMessage modal
    const [teacherMessageOpen, setTeacherMessageOpen] = useState<boolean>(false)
    const [teacherMessage, setTeacherMessage] = useState<string>("")

    const submitMessage = () => {
        if(user.state!=="hasData" || teacherMessage.length===0) return
        ws.current?.emit("sendTeacherMessage", user.data.email, lec?.Id, teacherMessage)
        setTeacherMessage("")
        setTeacherMessageOpen(false)
    }

    if(status==="loading") return <div>LOADING</div>
    if(status==='error') return <div>error</div>
    
    return (
        <div className={`${montserrat.variable} font-sans`}>
            <MiniDrawer open={drawerOpen} handleDrawerOpen={openDrawer} handleDrawerClose={closeDrawer}>
                <div className="w-full h-screen relative flex flex-col">
                    <div className="grow flex flex-row">
                        <div className="w-[60%] h-full flex flex-col">
                            <div className="h-[60%] p-10">
                                <p className="text-6xl text-slate-600 font-medium">Activity:</p>
                                <div className="h-4"/>
                                {mapMessages()}
                            </div>
                            <div className="h-[40%] p-10 bg-slate-100">
                                <p className="text-4xl font-medium text-slate-700">Teacher Question Responses:</p>  
                                <div className="h-8"/>
                                <div className="flex flex-col">
                                    {mapTeacherQuestions()}
                                </div>
                            </div>
                        </div>

                        <div className="w-[40%] h-full bg-slate-200 p-10">
                            <div>
                                <p className="text-5xl font-medium">Student Questions</p>
                                <div className="h-16"/>
                                <div className="w-full h-full flex flex-col">
                                    {mapQuestions()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-none bg-slate-700 w-full h-32 flex flex-row p-10 align-center">
                        <div className="flex-none w-1/4 flex justify-start align-center">
                            <p className="text-4xl font-medium text-slate-200">Students in Session: {students}</p>
                        </div>
                        <div className="grow w-1/2 flex pr-[100px] justify-end align-center gap-10">
                            <button className='bg-slate-500 px-3 py-2 text-white font-medium rounded-lg border-slate-100 hover:-translate-y-1 hover:border-slate-200 hover:bg-slate-600 duration-300' onClick={() => setTeacherMessageOpen(true)}>Ask Question</button>
                            <button className='bg-green-500 px-3 py-2 text-white font-medium rounded-lg border-slate-100 hover:-translate-y-1 hover:border-green-200 hover:bg-green-600 duration-300' onClick={() => setResponsesOpen(true)}>Ask Question</button>
                            <button className="bg-red-600 px-3 py-2 text-white font-medium rounded-lg border-slate-700 hover:-translate-y-1 hover:bg-red-700 duration-300" onClick={closeRoom}>Close Lecture</button>
                        </div>
                    </div>
                </div>
            </MiniDrawer>
            <Modal open={responsesOpen} close={() => setResponsesOpen(false)} height="30vh">
                <div className="p-10 flex flex-col gap-7 items-center">
                    <p className="font-medium text-4xl text-slate-800">Ask Question</p>
                    <form className="flex flex-col gap-5 w-[80%]">
                        <textarea value={teacherQuestion.question} placeholder="Question:" rows={3} cols={25} onChange={(e) => setTeacherQuestion({ question: e.target.value, answer: [] })} className="p-5 border-slate-400 border-2 duration-300 hover:border-green-500"/>
                        <hr className="w-48 h-1 mx-auto my-2 bg-slate-400 border-0 rounded dark:bg-gray-700"/>
                        <button className='bg-green-500 px-3 py-2 text-white font-medium rounded-lg hover:-translate-y-1 hover:bg-green-600 duration-300' onClick={createTeacherQuestion}>Ask</button>
                    </form> 
                </div>
            </Modal>
            <Modal open={modal} close={() => setModal(false)} height="40vh">
                <form className="p-10 flex flex-col gap-7 items-center">
                    <h4 className="font-medium text-4xl text-slate-800">Submit your response</h4>
                    <p><span className="font-medium">Question:</span> {currentModal?.question}</p>
                    <textarea cols={40} rows={6} value={answer} onChange={e => setAnswer(e.target.value)}  placeholder="your answer:" className="p-5 border-slate-400 border-2 duration-300 hover:border-green-500"/>
                    <button onClick={submitQuestionResponse} className='bg-green-500 px-3 py-2 text-white font-medium rounded-lg hover:-translate-y-1 hover:bg-green-600 duration-300'>Answer Question</button>
                </form>
            </Modal>
            <Modal open={openAnswers} close={() => setOpenAnswers(false)} height="50vh">
                <div className="p-10 flex flex-col gap-7 items-center">
                    <h1 className="font-medium text-4xl text-slate-800">Question Answers</h1>
                    <p><span className="font-medium">Question:</span> {currentTeacherQuestion?.question}</p>
                    {mapAnswers()}
                </div>
            </Modal>
            <Modal open={teacherMessageOpen} close={() => setTeacherMessageOpen(false)} height="30vh">
                <div className="p-10 flex flex-col gap-7 items-center">
                    <h1 className="font-medium text-4xl text-slate-800">Send a message:</h1>
                    <textarea className='p-5 border-slate-400 border-2 duration-300 hover:border-green-500' value={teacherMessage} onChange={e => setTeacherMessage(e.target.value)}/>
                    <button onClick={submitMessage} className='bg-green-500 px-3 py-2 text-white font-medium rounded-lg hover:-translate-y-1 hover:bg-green-600 duration-300'>Send Message</button>
                </div>
            </Modal>
        </div>
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
import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import { Socket, io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture } from '@/lib/classData'
import { useUser, Email } from '@/lib/user'
import { TextField } from '@mui/material'
import Modal from '@/components/Modal/Modal'
import MiniDrawer from '@/components/Dashboard/Drawer'
import { montserrat } from '@/styles/fonts'

// IMPORTANT FOR LATER: add check for lecture being accessed is in the right class

export default function StudentLecture() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [lec, setLec] = useState<Lecture>()
    const [students, setStudents] = useState<number>(0)
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

    // socket handler setup
    useEffect(() => {
        const socket = io("ws://localhost:8080", {
            transports: ["websocket"]
        })
        socket.connect()

        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.on("studentJoins", num => {console.log("joined! ", num);setStudents(num)})
        socket.on("studentLeaves", num => setStudents(num))
        socket.on("roomClosed", leave)
        socket.on("roomClosed", closeRoom)
        socket.on("sendStudentQuestionResponse", (response: string, question: string) => setAnswer(response))

        socket.on("receiveTeacherQuestion", prompt => {
            console.log("oldTeacherQuestions: ", teacherQuestions)
            setTeacherQuestions(teacherQuestions => [...teacherQuestions, { prompt }])
        })

        ws.current = socket

        return () => {
            socket.disconnect()
        }
    }, [])


    const leave = () => {
        // socket.close()
        router.push(`/student/${lec?.ClassID}`)
    }

    useWindowUnloadEffect(leave)

    const closeRoom = () => {
        if(user.state!=="hasData") return
        console.log("lectureID: ", lec?.Id)
        console.log("classid: ", lec?.ClassID)
        console.log("note: ", note)
        ws.current?.emit("leaveRoom", user.data.email, lec?.Id, lec?.Name, note)
        leave()
    }

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        if(status==='success'&&user.state==="hasData") {
            if(lec?.Isstopped) router.push(`/student/${lec?.ClassID}`) 
            ws.current?.emit("joinRoom", user.data.email, data.Id, data.ClassID)
        }
    }, [status, user, data])

    // question asking stuff

    const [question, setQuestion] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")

    const submitQuestion = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        if(user.state!=="hasData") return 
        e.preventDefault()
        ws.current?.emit("createStudentQuestion", user.data.email, lec?.Id, question)
    }

    // question answering stuff

    const [teacherQuestions, setTeacherQuestions] = useState<TeacherQuestion[]>([])
    const [currentTeacherQuestion, setCurrentTeacherQuestion] = useState<TeacherQuestion>()
    const [open, setOpen] = useState<boolean>(false)
    const [studentAnswer, setStudentAnswer] = useState<string>("")

    const openModal = (q: TeacherQuestion) => {
        setCurrentTeacherQuestion(q)
        setOpen(true)
    }

    const submitAnswer = () => {
        if(user.state!=="hasData") return
        ws.current?.emit("answerTeacherQuestion", user.data.email, lec?.Id, studentAnswer, currentTeacherQuestion?.prompt)
        console.log("answered teacher question!!")
        setOpen(false)
    }

    const mapTeacherQuestions = () => {
        console.log("teacher questions: ", teacherQuestions)
        return teacherQuestions.map((q: TeacherQuestion) => (
            <div>
                <p>Question: {q.prompt}</p>
                <button onClick={() => openModal(q)}>Answer Question</button>
            </div>
        ))
    }

    // note taking stuff

    const [note, setNote] = useState<string>("")

    // modal states
    const [drawer, setDrawer] = useState<boolean>(false)

    if(status==="loading") return <div>LOADING</div>
    if(status==='error') return <div>error</div>

    const [seeResponsesModal, setSeeResponsesModal] = useState<boolean>(false)
    
    return (
        <div className={`${montserrat.variable} font-sans`}>
            <MiniDrawer open={drawer} handleDrawerClose={() => setDrawer(false)} handleDrawerOpen={() => setDrawer(true)}>
            <div className="w-full h-screen relative flex flex-col">
                    <div className="grow flex flex-row">
                        <div className="w-[60%] h-full flex flex-col">
                            <div className="h-[60%]">
                                <div>
                                    Notes to take:
                                    <textarea value={note} onChange={e => setNote(e.target.value)} rows={20} cols={50}/>
                                </div>
                            </div>
                            <div className="h-[40%] p-10 bg-slate-100">
                                <p className="text-4xl font-medium text-slate-700">Have a Question?</p>  
                                <p>Answer to your last question: {answer}</p>
                                <form onSubmit={submitQuestion}>
                                    <textarea value={question} placeholder="Question:" rows={3} cols={25} onChange={(e) => setQuestion(e.target.value)}/>
                                    <button type="submit">Ask Question</button>
                                </form>
                            </div>
                        </div>

                        <div className="w-[40%] h-full bg-slate-200 p-10">
                            <div>
                                <p className="text-5xl font-medium">Teacher Questions</p>
                                <div className="h-16"/>
                                <div className="w-full h-full flex flex-col">
                                    {mapTeacherQuestions()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-none bg-slate-700 w-full h-32 flex flex-row p-10 align-center">
                        <div className="w-1/2 flex justify-start align-center">
                            <p className="text-4xl font-medium text-slate-200">Students in Session: {students}</p>
                        </div>
                        <div className="w-1/2 flex justify-end align-center pr-[100px] gap-10">
                            {/* <button className='bg-green-500 px-3 py-2 text-white font-medium rounded-lg border-slate-100 hover:-translate-y-1 hover:border-green-200 hover:bg-green-600 duration-300' onClick={closeRoom}>Ask Question</button> */}
                            <button className="bg-red-600 px-3 py-2 text-white font-medium rounded-lg border-slate-700 hover:-translate-y-1 hover:bg-red-700 duration-300" onClick={leave}>Leave Lecture</button>
                        </div>
                    </div>
                </div>
            </MiniDrawer>
            <Modal open={open} close={() => setOpen(false)} height="50vh">
                <h1>Submit answer to question</h1>
                <p>Question: {currentTeacherQuestion?.prompt}</p>
                <textarea rows={5} cols={30} value={studentAnswer} onChange={e => setStudentAnswer(e.target.value)}/>
                <button onClick={submitAnswer}>Submit Answer</button>
            </Modal>

        </div>
    )
    // NOTES: events to emit - createRoom, deleteRoom, for student: joinRoom leaveRoom (with notes UI)
    // render a list of people in the meeting and change when receiving a leave or join room

}

const useWindowUnloadEffect = (handler: () => unknown, callOnCleanup: boolean = false) => {
    const cb = useRef()
    
    // cb.current = handler
    
    useEffect(() => {
    //   const handler = () => cb.current()
    
      window.addEventListener('beforeunload', handler)
      
      return () => {
        // if(callOnCleanup) handler()
      
        window.removeEventListener('beforeunload', handler)
      }
    }, [callOnCleanup])
  }
  
interface TeacherQuestion {
    prompt: string
}
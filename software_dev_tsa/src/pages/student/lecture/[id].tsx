import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Lecture } from '@/lib/classData'
import { useUser, Email } from '@/lib/user'
import { TextField } from '@mui/material'
import Modal from '@/components/Modal/Modal'

// IMPORTANT FOR LATER: add check for lecture being accessed is in the right class

export default function TeacherLecture() {
    const router = useRouter()
    const user = useUser()
    const { id } = router.query
    const [lec, setLec] = useState<Lecture>()
    const [students, setStudents] = useState<number>(0)

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

    const socket = io("ws://localhost:8080", {
        transports: ["websocket"]
    })

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    const leave = () => {
        socket.close()
        router.push(`/student/${lec?.ClassID}`)
    }

    useWindowUnloadEffect(leave)

    socket.on("studentJoins", num => {console.log("joined! ", num);setStudents(num)})
    socket.on("studentLeaves", num => setStudents(num))
    socket.on("roomClosed", leave)

    const closeRoom = () => {
        if(user.state!=="hasData") return
        console.log("lectureID: ", lec?.Id)
        console.log("classid: ", lec?.ClassID)
        socket.emit("leaveRoom", user.data.email, lec?.Id)
        router.push(`/student/${lec?.ClassID}`)
    }

    // select the desired lecture based on the ID fetched from the route
    useEffect(() => {
        if(status==='success'&&user.state==="hasData") {
            if(lec?.Isstopped) router.push(`/student/${lec?.ClassID}`) 
            socket.emit("joinRoom", user.data.email, data.Id, data.ClassID)
        }
    }, [status, user.state])

    // question asking stuff

    const [question, setQuestion] = useState<string>("")
    const [answer, setAnswer] = useState<string>("")

    const submitQuestion = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        if(user.state!=="hasData") return 
        e.preventDefault()
        socket.emit("createStudentQuestion", user.data.email, lec?.Id, question)
    }

    socket.on("sendStudentQuestionResponse", (response: string, question: string) => setAnswer(response))

    // question answering stuff

    const [teacherQuestions, setTeacherQuestions] = useState<TeacherQuestion[]>([])
    const [currentTeacherQuestion, setCurrentTeacherQuestion] = useState<TeacherQuestion>()
    const [open, setOpen] = useState<boolean>(false)
    const [studentAnswer, setStudentAnswer] = useState<string>("")

    socket.on("receiveTeacherQuestion", prompt => {
        setTeacherQuestions([...teacherQuestions, { prompt }])
    })

    const openModal = (q: TeacherQuestion) => {
        setCurrentTeacherQuestion(q)
        setOpen(true)
    }

    const submitAnswer = () => {
        if(user.state!=="hasData") return
        socket.emit("answerTeacherQuestion", user.data.email, lec?.Id, studentAnswer, currentTeacherQuestion?.prompt)
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

    if(status==="loading") return <div>LOADING</div>
    if(status==='error') return <div>error</div>
    
    return (
        <>
            <p>{students}</p>
            <button onClick={closeRoom}>Close Room</button>
            <br/><br/><br/>
            <form onSubmit={submitQuestion}>
                <p>HAVE A QUESTION?</p>
                <textarea value={question} placeholder="Question:" rows={3} cols={25} onChange={(e) => setQuestion(e.target.value)}/>
                <button type="submit">Ask Question</button>
            </form>
            <br/>
            <div>
                Questions from the teacher:
                {mapTeacherQuestions()}
            </div>
            <p>Answer to your last question: {answer}</p>
            <Modal open={open} close={() => setOpen(false)}>
                <h1>Submit answer to question</h1>
                <p>Question: {currentTeacherQuestion?.prompt}</p>
                <textarea rows={5} cols={30} value={studentAnswer} onChange={e => setStudentAnswer(e.target.value)}/>
                <button onClick={submitAnswer}>Submit Answer</button>
            </Modal>
        </>
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
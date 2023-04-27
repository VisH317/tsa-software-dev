import { montserrat } from '@/styles/fonts'
import React, { useState } from 'react'
import type { Message } from '@/pages/api/chatbot'

export default function Chat() {

    const [question, setQuestion] = useState<string>("")
    const [response, setResponse] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([{ role: "system", content: "" }])

    const submitQuestion = () => {

    }

    return (
        <div className={`h-screen w-screen flex flex-row divide-x divide-slate-300 bg-slate-50 ${montserrat.variable} font-sans`}>
            <div className="w-1/2 p-10 relative">
                <p className="text-6xl text-slate-800">Ask a question: </p>
                <div className="h-6"/>
                <textarea className="p-5 bg-transparent outline-none border-slate-400 border-2 hover:border-green-500 focus:border-green-500 w-full h-[70%] duration-300" placeholder="Question: " value={question} onChange={e => setQuestion(e.target.value)}/>
                <div className="h-10"/>
                <button className="w-full border-green-500 border-2 py-5 text-2xl text-green-500 rounded-lg duration-300 hover:-translate-y-1 hover:shadow-lg hover:text-white hover:bg-green-500">Submit Question</button>
            </div>
            <div className="w-1/2 p-10">
                {response.length===0 ? "Ask a question..." : response}
            </div>
        </div>
    )
}
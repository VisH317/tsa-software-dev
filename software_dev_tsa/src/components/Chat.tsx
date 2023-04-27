import { montserrat } from '@/styles/fonts'
import React, { useEffect, useState } from 'react'
import type { Message } from '@/pages/api/chatbot'

export default function Chat() {

    const [question, setQuestion] = useState<string>("")
    const [response, setResponse] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([])
    const [disabled, setDisabled] = useState<boolean>(true)

    useEffect(() => {
        if(question.length>=0) setDisabled(false)
    }, [question])

    async function sendChat() {
        setMessages([...messages, { role: "user", content: question }])
        const finalPrompt = messages.map((message:Message) => message.role + ": " + message.content).join("\n\n")
        console.log("final",finalPrompt)
        
        try {
          const response = await fetch("/api/chatbot", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: "You are a tutor that always responds in the Socratic style. You *never* give the student the answer, but always try to nudge them learn to think for themselves. You should always tune your suggestion to the interest & knowledge of the student. Currently, you are helping a student with an assignment." + context + "\n" + finalPrompt + "\n AI:"  }),
          });
    
          const data = await response.json();
          if (response.status !== 200) {
            throw data.error || new Error(`Request failed with status ${response.status}`);
          }
    
          setResponse(response + `\n\n${data.result}`);
       
          const newResult: Message = { role: "system", content: data.result};
          setMessages([...messages, newResult]);
          console.log(messages)
          setQuestion("")
        } catch(error) {
          // Consider implementing your own error handling logic here
          console.error(error);
        //   alert(error.message);
        }
      }

    return (
        <div className={`h-screen w-screen flex flex-row divide-x divide-slate-300 bg-slate-50 ${montserrat.variable} font-sans`}>
            <div className="w-1/2 p-10 relative">
                <p className="text-6xl text-slate-800">Ask a question: </p>
                <div className="h-6"/>
                <textarea className="p-5 bg-transparent outline-none border-slate-400 border-2 hover:border-green-500 focus:border-green-500 w-full h-[70%] duration-300" placeholder="Question: " value={question} onChange={e => setQuestion(e.target.value)}/>
                <div className="h-10"/>
                <button disabled={disabled} className="w-full enabled:border-green-500 disabled:border-slate-500 disabled:cursor-not-allowed border-2 py-5 text-2xl text-green-500 rounded-lg duration-300 enabled:hover:-translate-y-1 enabled:hover:shadow-lg enabled:hover:text-white enabled:hover:bg-green-500" onClick={sendChat}>Submit Question</button>
            </div>
            <div className="w-1/2 p-10">
                {response.length===0 ? "Ask a question..." : response}
            </div>
        </div>
    )
}
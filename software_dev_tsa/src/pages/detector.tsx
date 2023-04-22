import * as React from "react";
import { Button } from '@mui/material';
import { useState } from "react";
import getContent from "../pages/api/googleContent"



// const acceptedFormats: string | AcceptedFileType[] = typeof fileType === "string" ? fileType : Array.isArray(fileType) ? fileType?.join(",") : AcceptedFileType.Text;

export default function detector() {
   
    const [link, setLink] = useState<string>("");
    const excludedSubstrings = ["https:", "", "docs.google.com","document","d","edit"];

    const onLinkChange = () => {
        console.log(link)
        let linkBrokenUp = link.split("/");
        console.log(linkBrokenUp,"linkBrokenUp")
        const filteredLink = linkBrokenUp.filter(substring => !excludedSubstrings.includes(substring))
        console.log(filteredLink[0])
        // getContent(,)
    };

    return (
        <div style={{display:"flex", justifyContent:"center"}}>
            <label>Enter a link:</label>
            <input type="text" id="link-input" value={link} onChange={(e)=> setLink(e.target.value)} name="link" placeholder="https://example.com" required></input>
            <button onClick={()=>{onLinkChange()}}>Generate</button>
        </div>
      
    );
};

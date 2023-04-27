import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
    apiKey: "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"
    //Guys, I can't make a Api KEY and push to github. So go to this link https://platform.openai.com/docs/quickstart/build-your-application, and scroll down and make your own API KEY.
});

const openai = new OpenAIApi(configuration);

export default async function generatePrompt (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const msgs: Message[] = req.body
    if (msgs.length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid prompt",
            }
        });
        return;
    }
    console.log(prompt)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: prompt,
        temperature: 0.5,
        max_tokens: 60,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
    });
    // console.log("completion", completion, "completion.data", completion.data,"completion.data.choices", completion.data.choices )
    res.status(200).json({  result: completion.data.choices[0].text });
}

export type Message = {
    role: "system" | "user" | "assistant",
    content: string
}
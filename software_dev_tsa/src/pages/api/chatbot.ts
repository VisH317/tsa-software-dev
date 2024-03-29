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

    const prompt = req.body.prompt || '';
    if (prompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid prompt",
            }
        });
        return;
    }
    console.log(prompt)
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 60,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        });
        // console.log("completion", completion, "completion.data", completion.data,"completion.data.choices", completion.data.choices )
        console.log("completion: ", completion.data.choices[0].message?.content)
        res.status(200).json({  result: completion.data.choices[0].message?.content });
    } catch (error: any) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            })
        }
    }


}

export type Message = {
    role: "system" | "user" | "assistant",
    content: string[]
}
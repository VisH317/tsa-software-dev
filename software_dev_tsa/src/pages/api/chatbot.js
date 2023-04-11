import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
    apiKey: "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"
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
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.6,
        });
        console.log("completion", completion, "completion.data", completion.data,"completion.data.choices", completion.data.choices )
        res.status(200).json({ result: completion.data.choices[0].text });
    } catch (error) {
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


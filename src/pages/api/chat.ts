import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams";
import { Readable } from "stream";
import { yieldStream } from "yield-stream";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).send("Did not include `prompt` parameter");
  }
  
  const stream = await OpenAI("chat", {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      }
    ],
  });

  return Readable.from(yieldStream(stream)).pipe(res);
}

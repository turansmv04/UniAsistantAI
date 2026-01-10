import { NextRequest } from "next/server";
import Bytez from "bytez.js";

const key = process.env.NODE_ENV ;
const sdk = new Bytez(key);
const model = sdk.model("openai/gtp-4o");
 
async function POST(res:NextRequest) {
try{
    const {messages} = await req.json();
    const systemPrompt = `dsgdgsdgdg`;
const result = await model.run([
    {role:"system", content:systemPrompt},...messages
]);

const botReply = result.output?.content ||
(Array.isArray(result.output)? result.output[0]?.message?.content: "") ||
"Xeta bas verdi."
return new Response(botReply);
}
catch (err:unknown) {
    const errorMsg: err     
};
)
}
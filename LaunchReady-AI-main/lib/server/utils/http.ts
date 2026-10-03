export async function readJson(request:Request){const text=await request.text();if(text.length>1_000_000)throw new Error('Request is too large.');if(!text.trim())return {};try{return JSON.parse(text)}catch{throw new Error('Invalid JSON request.')}}
export function bad(message:string,status=400){return Response.json({error:message},{status})}

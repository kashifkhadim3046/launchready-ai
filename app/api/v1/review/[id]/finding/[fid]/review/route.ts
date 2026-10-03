import { humanReviewHandler } from '@/lib/server/api'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function POST(request:Request,{params}:{params:Promise<{id:string;fid:string}>}){const {id,fid}=await params;return humanReviewHandler(request,id,fid)}

import { missionLoadHandler } from '@/lib/server/api'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function POST(request:Request){return missionLoadHandler(request)}

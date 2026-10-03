import type { MissionPackage, ReviewJob, ReviewReport } from '../types/contracts'
class Store { missions=new Map<string,MissionPackage>(); jobs=new Map<string,ReviewJob>(); reports=new Map<string,ReviewReport>() }
export const reviewStore = new Store()

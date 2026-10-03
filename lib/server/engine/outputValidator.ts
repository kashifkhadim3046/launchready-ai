import type { BackendFinding, MissionPackage, ReviewReport } from '../types/contracts'
import { DIFF_CATEGORIES, EVALUATIONS, TRENDS, CONFIDENCE, PRIORITIES } from '../types/contracts'

const allowedActions = new Set(['REPEAT_TEST','INSPECT_SENSOR','UPDATE_EVIDENCE','RECHECK_CONDITIONS','REQUEST_ENGINEERING_REVIEW'])
export function validateComputedFinding(f: BackendFinding, pkg: MissionPackage) {
  const errors:string[]=[]
  if (!EVALUATIONS.includes(f.status)) errors.push(`Unsupported evaluation status: ${f.status}`)
  if (!DIFF_CATEGORIES.includes(f.diff_category)) errors.push(`Unsupported diff category: ${f.diff_category}`)
  if (!TRENDS.includes(f.trend.label)) errors.push(`Unsupported trend: ${f.trend.label}`)
  if (!CONFIDENCE.includes(f.evidence_confidence.level)) errors.push(`Unsupported evidence confidence: ${f.evidence_confidence.level}`)
  if (!PRIORITIES.includes(f.priority)) errors.push(`Unsupported priority: ${f.priority}`)
  if (!allowedActions.has(f.recommended_next_step.category)) errors.push('Unsupported recommended action.')
  const req=pkg.requirements.find(r=>r.requirement_id===f.requirement_id); if(!req) errors.push(`Unknown requirement: ${f.requirement_id}`)
  for(const id of f.document_chunk_ids) if(!pkg.documents.some(d=>d.chunk_id===id)) errors.push(`Unknown document chunk: ${id}`)
  for(const id of f.data_ids) if(!pkg.observations.some(o=>o.data_id===id)) errors.push(`Unknown observation: ${id}`)
  return errors
}
export function validateReport(report: ReviewReport, pkg: MissionPackage) {
  const errors=report.findings.flatMap(f=>validateComputedFinding(f,pkg))
  if (report.disclaimer !== 'Human engineering review required. This tool does not approve or certify launches.') errors.push('Fixed disclaimer was altered.')
  return {valid:errors.length===0,errors}
}

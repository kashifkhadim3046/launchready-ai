import { findings, mission } from '@/lib/mission'
import type { MissionPackage, Requirement, Observation, ChecklistItem, DocumentChunk, ReviewReport } from '../types/contracts'

const iso = (i:number) => `2026-10-02T14:${String(i*5).padStart(2,'0')}:00Z`
const requirements: Requirement[] = findings.map((f, i) => ({
  requirement_id: f.requirement.split('·')[0].trim(), version:'1', item_id:f.id, subsystem:f.subsystem,
  parameter:f.dataId ? f.title : undefined, operator:'<=', bounds:f.limit === null ? {} : {upper:f.limit}, unit:f.unit || undefined,
  priority:f.priority, source:f.source?.id, required_evidence_types:f.gap ? ['DOCUMENT'] : ['OBSERVATION'], freshness_window_minutes:60,
  trend_configuration:{minimum_samples:5, minimum_duration_minutes:20, tolerance:0.05}, demo_assumption:true,
}))
const observations: Observation[] = []
for (const f of findings) {
  f.series.forEach((s, i) => observations.push({data_id:`${f.dataId ?? f.id}-S${i+1}`, test_id:f.dataId ?? f.id, timestamp:iso(i), parameter:f.id, value:s.value, unit:f.unit, subsystem:f.subsystem, configuration_version:'aster-2-demo-v1', valid:true, test_conditions:{scenario:'ASTER-2', simulated:true}}))
}
const documents: DocumentChunk[] = findings.filter(f=>f.source).map(f=>({document_id:f.source!.id, version:'1', title:f.source!.title, section:f.source!.section, chunk_id:f.source!.id+'-CHUNK-01', passage:f.source!.excerpt, simulation_label:'SIMULATED DEMO'}))
const checklist: ChecklistItem[] = [
  {item_id:'RECOVERY-CHECKLIST', state:'COMPLETE', timestamp:mission.timestamp, evidence_ids:['RECOVERY-CHECK-01']},
  {item_id:'FIN-INSPECTION', state:'OPEN', timestamp:mission.timestamp, evidence_ids:[]},
  {item_id:'BOND-INSPECTION', state:'OPEN', timestamp:mission.timestamp, evidence_ids:[]},
]
export const aster2Package: MissionPackage = { mission_id:mission.id, name:mission.name, configuration_version:'aster-2-demo-v1', simulation_label:'SIMULATED DEMO', requirements, observations, checklist, documents, previous_review_id:'ASTER-2-R1' }
export function baselineFindingSnapshot() { return findings.map(f=>({ finding_id:f.id, item_id:f.id, subsystem:f.subsystem, status:f.evaluation, priority:f.priority, diff_category:'UNCHANGED', still_open:f.evaluation !== 'CHECK_PASSED', requirement_id:f.requirement.split('·')[0].trim(), requirement_version:'1', demo_assumption:true, data_ids:f.dataId ? [f.dataId] : [], metrics:{previous:f.previous,current:f.current,unit:f.unit,upper_limit:f.limit,lower_limit:null,absolute_change:null,percentage_change:null,exceedance:null}, trend:{label:f.trend,sample_count:f.series.length,window_minutes:30}, evidence_confidence:{level:f.confidence,reasons:f.confidenceReasons}, evidence_flags:f.gap ? ['ABSENT'] : [], evidence_chain:{requirement_id:f.requirement.split('·')[0].trim(),data_ids:f.dataId ? [f.dataId] : [],document_chunk_ids:f.source ? [f.source.id+'-CHUNK-01'] : [],missing_links:f.source ? [] : ['supporting document']}, document_chunk_ids:f.source ? [f.source.id+'-CHUNK-01'] : [], impact:f.impact, recommended_next_step:{category:'REQUEST_ENGINEERING_REVIEW',target:f.id,rationale:'Baseline fixture'}, title:f.title })) }
export function sampleReport(): ReviewReport { return { review_id:'ASTER-2-R2-SAMPLE', mission_id:mission.id, input_fingerprint:'sample-fixture', rule_engine_version:'1.0.0', processing_time_ms:0, processing_mode:'DETERMINISTIC', status:'COMPLETE', stages:['Validate','Normalize','Evaluate Rules','Analyze Trends','Compare Reviews','Retrieve Evidence','Assemble and Validate Report','Save'], findings:[], summary:{total:0,passed:0,review_required:0,missing_evidence:0,evidence_gaps:0}, previous_review_id:'ASTER-2-R1', created_at:mission.timestamp, updated_at:mission.timestamp, disclaimer:'Human engineering review required. This tool does not approve or certify launches.', human_review:{} } }

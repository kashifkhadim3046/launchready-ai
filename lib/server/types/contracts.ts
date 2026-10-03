export const EVALUATIONS = ['CHECK_PASSED','REVIEW_REQUIRED','MISSING_EVIDENCE'] as const
export type Evaluation = typeof EVALUATIONS[number]
export const DIFF_CATEGORIES = ['NEW','RESOLVED','CHANGED','UNRESOLVED','UNCHANGED','NOT_COMPARABLE'] as const
export type DiffCategory = typeof DIFF_CATEGORIES[number]
export const TRENDS = ['IMPROVING','STABLE','WORSENING','INSUFFICIENT_DATA'] as const
export type Trend = typeof TRENDS[number]
export const CONFIDENCE = ['HIGH','MEDIUM','LOW'] as const
export type Confidence = typeof CONFIDENCE[number]
export const EVIDENCE_FLAGS = ['ABSENT','STALE','INVALID','CONFLICTING','MISSING_DOCUMENT'] as const
export type EvidenceFlag = typeof EVIDENCE_FLAGS[number]
export const PRIORITIES = ['HIGH','MEDIUM','LOW'] as const
export type Priority = typeof PRIORITIES[number]
export const DISPOSITIONS = ['PENDING','ACKNOWLEDGED','NEEDS_ACTION','DISMISSED_WITH_NOTE'] as const
export type Disposition = typeof DISPOSITIONS[number]

export interface Requirement { requirement_id:string; version:string; item_id:string; subsystem:string; parameter?:string; operator?:string; bounds?:{lower?:number|null; upper?:number|null}; unit?:string; priority:Priority; source?:string; required_evidence_types:string[]; freshness_window_minutes?:number; trend_configuration?:{minimum_samples:number; minimum_duration_minutes:number; tolerance:number}; demo_assumption:boolean }
export interface Observation { data_id:string; test_id:string; timestamp:string; parameter:string; value:number; unit:string; subsystem:string; configuration_version:string; valid?:boolean; test_conditions?:Record<string,string|number|boolean> }
export interface DocumentChunk { document_id:string; version:string; title:string; section:string; chunk_id:string; passage:string; simulation_label?:string }
export interface ChecklistItem { item_id:string; state:string; timestamp?:string; evidence_ids?:string[] }
export interface MissionPackage { mission_id:string; name:string; configuration_version:string; simulation_label:string; requirements:Requirement[]; observations:Observation[]; checklist:ChecklistItem[]; documents:DocumentChunk[]; previous_review_id?:string|null }
export interface FindingMetrics { previous:number|null; current:number|null; unit:string; upper_limit:number|null; lower_limit:number|null; absolute_change:number|null; percentage_change:number|null; exceedance:number|null }
export interface EvidenceConfidence { level:Confidence; reasons:string[] }
export interface EvidenceLink { requirement_id?:string; data_ids:string[]; document_chunk_ids:string[]; missing_links:string[] }
export interface RecommendedNextStep { category:'REPEAT_TEST'|'INSPECT_SENSOR'|'UPDATE_EVIDENCE'|'RECHECK_CONDITIONS'|'REQUEST_ENGINEERING_REVIEW'; target:string; rationale:string; procedure_id?:string }
export interface BackendFinding { finding_id:string; item_id:string; subsystem:string; status:Evaluation; priority:Priority; diff_category:DiffCategory; still_open:boolean; requirement_id:string; requirement_version:string; demo_assumption:boolean; data_ids:string[]; metrics:FindingMetrics; trend:{label:Trend; sample_count:number; window_minutes:number}; evidence_confidence:EvidenceConfidence; evidence_flags:EvidenceFlag[]; evidence_chain:EvidenceLink; document_chunk_ids:string[]; impact:string; recommended_next_step:RecommendedNextStep; title:string }
export interface ReviewReport { review_id:string; mission_id:string; input_fingerprint:string; rule_engine_version:string; processing_time_ms:number; processing_mode:'DETERMINISTIC'|'AI'|'FALLBACK'; status:'PROCESSING'|'COMPLETE'|'FAILED'; stages:string[]; findings:BackendFinding[]; summary:{total:number; passed:number; review_required:number; missing_evidence:number; evidence_gaps:number}; previous_review_id:string|null; created_at:string; updated_at:string; disclaimer:string; human_review:Record<string,{disposition:Disposition; note:string; timestamp:string}> }
export interface ReviewJob { id:string; report:ReviewReport|null; stage:string; error?:string; started_at:string; updated_at:string }
export interface ReviewRequest { mission_id:string; package?:MissionPackage; previous_review_id?:string|null }
export interface HumanReviewRequest { disposition:Disposition; note:string; reviewer_label?:string }

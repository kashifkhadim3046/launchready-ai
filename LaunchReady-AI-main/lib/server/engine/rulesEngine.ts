import type { MissionPackage, Requirement, Evaluation, BackendFinding, EvidenceFlag } from '../types/contracts'
function matches(r:Requirement,o:any){ if(!o || o.valid===false) return false; if(r.parameter && o.parameter!==r.item_id && o.parameter!==r.parameter && o.test_id!==r.item_id) return false; if(r.unit && o.unit!==r.unit) return false; return true }
function evaluate(r:Requirement, observations:any[], checklist:any[]): {status:Evaluation; dataIds:string[]; flags:EvidenceFlag[]} {
 const os=observations.filter(o=>matches(r,o)); const flags:EvidenceFlag[]=[]
 if(r.required_evidence_types.includes('DOCUMENT') && !observations.length) flags.push('MISSING_DOCUMENT')
 const linkedDocs = r.source ? true : false
 if(r.required_evidence_types.includes('DOCUMENT') && !linkedDocs) flags.push('MISSING_DOCUMENT')
 if(!os.length){ const item=checklist.find(c=>c.item_id===r.item_id); if(item?.state!=='COMPLETE') flags.push('ABSENT'); return {status:'MISSING_EVIDENCE',dataIds:[],flags:[...new Set(flags)]} }
 const current=os.sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp))[0]
 const upper=r.bounds?.upper; const lower=r.bounds?.lower
 const violation = upper!=null ? current.value>upper : lower!=null ? current.value<lower : false
 if(violation) return {status:'REVIEW_REQUIRED',dataIds:os.map(o=>o.data_id),flags:[...new Set(flags)]}
 if(flags.length) return {status:'MISSING_EVIDENCE',dataIds:os.map(o=>o.data_id),flags:[...new Set(flags)]}
 return {status:'CHECK_PASSED',dataIds:os.map(o=>o.data_id),flags:[]}
}
export function evaluateRules(pkg:MissionPackage): BackendFinding[] {
 return pkg.requirements.map(r=>{
   const result=evaluate(r,pkg.observations,pkg.checklist); const os=pkg.observations.filter(o=>result.dataIds.includes(o.data_id)).sort((a,b)=>Date.parse(a.timestamp)-Date.parse(b.timestamp)); const prev=os.length>1?os[0].value:null; const cur=os.length?os[os.length-1].value:null; const limit=r.bounds?.upper ?? r.bounds?.lower ?? null; const docIds=r.source ? pkg.documents.filter(d=>d.document_id===r.source).map(d=>d.chunk_id):[]; const gap=result.status==='MISSING_EVIDENCE'||result.flags.length>0; const currentFinding:any={finding_id:r.item_id,item_id:r.item_id,subsystem:r.subsystem,status:result.status,priority:r.priority,diff_category:'UNCHANGED' as const,still_open:result.status!=='CHECK_PASSED',requirement_id:r.requirement_id,requirement_version:r.version,demo_assumption:r.demo_assumption,data_ids:result.dataIds,metrics:{previous:prev,current:cur,unit:r.unit??'',upper_limit:r.bounds?.upper??null,lower_limit:r.bounds?.lower??null,absolute_change:prev!=null&&cur!=null?cur-prev:null,percentage_change:prev!=null&&prev!==0&&cur!=null?((cur-prev)/Math.abs(prev))*100:null,exceedance:cur!=null&&limit!=null?(r.bounds?.upper!=null?cur-limit:limit-cur):null},trend:{label:'INSUFFICIENT_DATA',sample_count:os.length,window_minutes:os.length>1?(Date.parse(os[os.length-1].timestamp)-Date.parse(os[0].timestamp))/60000:0},evidence_confidence:{level:gap?'LOW':'HIGH',reasons:gap?['Required evidence is absent, stale, unusable, or incomplete.']:['Requirement is traceable and structured inputs are valid.']},evidence_flags:result.flags,evidence_chain:{requirement_id:r.requirement_id,data_ids:result.dataIds,document_chunk_ids:docIds,missing_links:[...(docIds.length?[]:['supporting document'])]},document_chunk_ids:docIds,impact:'Computed from configured deterministic rules and supplied observations.',recommended_next_step:{category:gap?'UPDATE_EVIDENCE':result.status==='REVIEW_REQUIRED'?'REQUEST_ENGINEERING_REVIEW':'RECHECK_CONDITIONS',target:r.item_id,rationale:'Follow the configured review workflow for this finding.'},title:r.item_id}; return currentFinding as BackendFinding
 })
}

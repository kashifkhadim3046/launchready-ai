import type { BackendFinding, DiffCategory } from '../types/contracts'
export function calculateDiff(current:BackendFinding[], previous:BackendFinding[]|null|undefined){
 if(!previous) return current.map(f=>({...f,diff_category:f.still_open?'NEW':'UNCHANGED'})) as BackendFinding[]
 const map=new Map(previous.map(f=>[f.item_id,f]))
 return current.map(f=>{const p=map.get(f.item_id); if(!p)return {...f,diff_category:f.still_open?'NEW':'UNCHANGED'}; if(f.requirement_version!==p.requirement_version)return {...f,diff_category:'NOT_COMPARABLE' as DiffCategory}; if(!p.still_open && !f.still_open)return {...f,diff_category:'UNCHANGED'}; if(p.still_open&&!f.still_open)return {...f,diff_category:'RESOLVED'}; const prev=f.metrics.previous, cur=f.metrics.current; const material=prev!=null&&cur!=null&&Math.abs(cur-prev)>0; return {...f,diff_category:material?'CHANGED':'UNRESOLVED'} }) as BackendFinding[]
}

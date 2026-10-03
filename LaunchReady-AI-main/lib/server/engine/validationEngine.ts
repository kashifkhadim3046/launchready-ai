import type { MissionPackage } from '../types/contracts'
const finite = (v:number) => Number.isFinite(v)
export function validateBundle(pkg: MissionPackage) {
  const errors:string[]=[]; const warnings:string[]=[]
  if (!pkg?.mission_id || !pkg.name || !pkg.configuration_version) errors.push('Mission metadata is incomplete.')
  const ids = new Set<string>()
  for (const r of pkg.requirements ?? []) { if (!r.requirement_id || !r.item_id) errors.push('Requirement is missing an ID.'); if (ids.has(r.item_id)) errors.push(`Duplicate requirement item_id: ${r.item_id}`); ids.add(r.item_id); if (!Array.isArray(r.required_evidence_types)) errors.push(`Requirement ${r.item_id} has invalid evidence types.`) }
  const obsIds=new Set<string>()
  for (const o of pkg.observations ?? []) { if (!o.data_id || obsIds.has(o.data_id)) errors.push(`Duplicate observation data_id: ${o.data_id}`); obsIds.add(o.data_id); if (!Number.isFinite(o.value)) errors.push(`Observation ${o.data_id} has a non-finite value.`); if (Number.isNaN(Date.parse(o.timestamp))) errors.push(`Observation ${o.data_id} has an invalid timestamp.`); if (!o.unit || !o.configuration_version) errors.push(`Observation ${o.data_id} is missing unit/configuration.`); }
  const chunks=new Set<string>(); for (const d of pkg.documents ?? []) { if (!d.document_id || !d.chunk_id || !d.passage) errors.push('Document chunk is incomplete.'); if (chunks.has(d.chunk_id)) errors.push(`Duplicate document chunk: ${d.chunk_id}`); chunks.add(d.chunk_id) }
  const requirementIds=new Set(pkg.requirements.map(r=>r.requirement_id)); for (const d of pkg.documents) if (!d.document_id) warnings.push('Document without ID ignored.')
  for (const o of pkg.observations) if (o.valid === false) warnings.push(`Observation ${o.data_id} is explicitly invalid.`)
  for (const r of pkg.requirements) if (r.source && !pkg.documents.some(d=>d.document_id===r.source)) warnings.push(`Requirement ${r.requirement_id} references missing document ${r.source}.`)
  return { valid:errors.length===0, errors, warnings, counts:{requirements:pkg.requirements.length,observations:pkg.observations.length,documents:pkg.documents.length,checklist:pkg.checklist.length}, referencedRequirementIds:[...requirementIds] }
}

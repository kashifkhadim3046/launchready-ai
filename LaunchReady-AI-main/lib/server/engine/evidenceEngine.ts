import type { MissionPackage, BackendFinding, EvidenceFlag } from '../types/contracts'

export function retrieveEvidence(findings: BackendFinding[], pkg: MissionPackage) {
  const validChunkIds = new Set(pkg.documents.map(d => d.chunk_id))
  for (const finding of findings) {
    const req = pkg.requirements.find(r => r.requirement_id === finding.requirement_id)
    const requested = req?.source ? pkg.documents.filter(d => d.document_id === req.source).map(d => d.chunk_id) : []
    const valid = requested.filter(id => validChunkIds.has(id))
    const invalid = requested.filter(id => !validChunkIds.has(id))
    finding.document_chunk_ids = valid
    finding.evidence_chain.document_chunk_ids = valid
    finding.evidence_flags = [...new Set([...finding.evidence_flags, ...(invalid.length ? ['INVALID' as EvidenceFlag] : [])])]
    if (!valid.length) finding.evidence_chain.missing_links = [...new Set([...finding.evidence_chain.missing_links, 'supporting document'])]
  }
  return findings
}

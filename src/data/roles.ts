export type StaffRole = {
  id: string
  code: string
  name: string
  description: string
}

// Role catalogue — extended to the full ~20-role taxonomy shown as matrix
// columns on the Staff Member Roles screen (AdminHub 67:5251), replacing
// the earlier 3-role placeholder list. Shared with the Roles page and the
// Staff Member Details roles tab so the app has one consistent role list
// rather than a smaller one everywhere else and a bigger one just for the
// matrix. Descriptions are plausible placeholders — no real permission
// model exists anywhere in the app.
export const staffRoles: StaffRole[] = [
  { id: '1', code: '12345A', name: 'Administrator', description: 'Full access to manage staff, roles and practice configuration.' },
  { id: '2', code: '20391B', name: 'Assistant', description: 'General administrative support access.' },
  { id: '3', code: '30482C', name: 'Clinical Practitioner Access', description: 'Access to clinical records and treatment workflows.' },
  { id: '4', code: '41573D', name: 'Community Nurse', description: 'Access for nursing staff working in community settings.' },
  { id: '5', code: '52664E', name: 'Federated Practitioner Access', description: 'Cross-organisation access for federated practitioners.' },
  { id: '6', code: '63755F', name: 'GP Registrar-A', description: 'Supervised clinical access for GP registrars, tier A.' },
  { id: '7', code: '74846G', name: 'GP Registrar-B', description: 'Supervised clinical access for GP registrars, tier B.' },
  { id: '8', code: '85937H', name: 'GP Registrar-C', description: 'Supervised clinical access for GP registrars, tier C.' },
  { id: '9', code: '96028I', name: 'Health Care Assistant-A', description: 'Support access for health care assistants, tier A.' },
  { id: '10', code: '07119J', name: 'Health Care Assistant-B', description: 'Support access for health care assistants, tier B.' },
  { id: '11', code: '18210K', name: 'Health Care Access Role-A', description: 'General health care access, tier A.' },
  { id: '12', code: '29301L', name: 'Health Care Access Role-B', description: 'General health care access, tier B.' },
  { id: '13', code: '30392M', name: 'Health Care Access Role-C', description: 'General health care access, tier C.' },
  { id: '14', code: '41483N', name: 'Health Visitor', description: 'Access for health visitors supporting patient home visits.' },
  { id: '15', code: '52574O', name: 'Partner', description: 'Access for practice partners across administrative and clinical areas.' },
  { id: '16', code: '63665P', name: 'Practice Nurse', description: 'Access for nursing staff based at the practice.' },
  { id: '17', code: '74756Q', name: 'Privacy Officer 1', description: 'Access to manage data privacy and access requests, tier 1.' },
  { id: '18', code: '85847R', name: 'Privacy Officer 2', description: 'Access to manage data privacy and access requests, tier 2.' },
  { id: '19', code: '96938S', name: 'Receptionist', description: 'Front desk access for scheduling and check-in.' },
  { id: '20', code: '07029T', name: 'Social Prescriber', description: 'Access for staff coordinating non-clinical patient support.' },
]

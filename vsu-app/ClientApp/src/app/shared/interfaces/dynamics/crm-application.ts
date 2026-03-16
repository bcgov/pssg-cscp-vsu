// NOTE: iCRMDocument uses different field names (filename/body/subject) from the
// generated DocumentDto (vsd_filename/vsd_body/vsd_subject) so it cannot be replaced
// directly without updating the reimbursement converter and interface.
export interface iCRMDocument {
  filename: string;
  body: string;
  subject: string;
}

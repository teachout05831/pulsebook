-- Phase 10: Activity log for audit trail on estimates, jobs, payments
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  performed_by uuid,
  performed_by_name text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_company ON activity_log(company_id);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_log_company_access" ON activity_log
  FOR ALL USING (company_id = get_active_company_id());

-- Contract status events: tracks workflow step transitions (Loading, In Transit, Unloading, etc.)
CREATE TABLE contract_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contract_instances(id) ON DELETE CASCADE,
  step_label TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID REFERENCES auth.users(id),
  gps_latitude DECIMAL,
  gps_longitude DECIMAL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contract_status_events ENABLE ROW LEVEL SECURITY;

-- Company isolation via contract_instances join
CREATE POLICY contract_status_events_company_isolation
  ON contract_status_events
  FOR ALL
  USING (
    contract_id IN (
      SELECT id FROM contract_instances
      WHERE company_id = get_active_company_id()
    )
  );

-- Public insert for signing token access (mover updating status via live link)
CREATE POLICY contract_status_events_public_insert
  ON contract_status_events
  FOR INSERT
  WITH CHECK (
    contract_id IN (
      SELECT id FROM contract_instances
      WHERE signing_token IS NOT NULL
    )
  );

CREATE INDEX idx_contract_status_events_contract
  ON contract_status_events(contract_id);

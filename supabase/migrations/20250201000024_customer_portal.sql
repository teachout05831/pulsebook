-- Customer Portal: link customers to auth users (mirrors team_members.user_id pattern)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id) WHERE user_id IS NOT NULL;

-- RLS: customer can read their own record via auth.uid()
CREATE POLICY "customers_self_read" ON customers
  FOR SELECT USING (user_id = auth.uid());

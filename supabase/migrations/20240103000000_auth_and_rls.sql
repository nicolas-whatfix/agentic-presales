-- ============================================================
-- 1. Restrict signup to @whatfix.com emails (server-side hook)
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL OR NEW.email NOT LIKE '%@whatfix.com' THEN
    RAISE EXCEPTION 'Registration is restricted to @whatfix.com email addresses.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER enforce_whatfix_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_email_domain();

-- ============================================================
-- 2. Enable RLS on all app tables
-- ============================================================
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_prompts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS policies — authenticated users only
-- ============================================================
CREATE POLICY "auth_read_settings"  ON app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write_settings" ON app_settings FOR ALL    TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_fields"    ON module_fields FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write_fields"   ON module_fields FOR ALL    TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_prompts"   ON module_prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write_prompts"  ON module_prompts FOR ALL    TO authenticated USING (true) WITH CHECK (true);

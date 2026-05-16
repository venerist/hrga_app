-- =============================================
-- FIX ATTENDANCE SUMMARY VIEW & SECURITY
-- =============================================

-- 1. Fix Security Warning
-- Change view from SECURITY DEFINER to SECURITY INVOKER for better security and RLS compliance.
ALTER VIEW IF EXISTS public.attendance_summary SET (security_invoker = true);

-- 2. Fix Column Mismatch (date -> attendance_date)
-- The code expects 'attendance_date', but the view likely provides 'date'.
-- We rename the column in the view to match the repository and types.
DO $$ 
BEGIN
    -- Check if column 'date' exists and 'attendance_date' does not
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'attendance_summary' 
        AND column_name = 'date'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'attendance_summary' 
        AND column_name = 'attendance_date'
    ) THEN
        ALTER VIEW public.attendance_summary RENAME COLUMN "date" TO attendance_date;
    END IF;
END $$;

-- 3. Audit Log for this fix
INSERT INTO audit_logs (action, metadata)
VALUES ('database_view_security_fix', '{"view": "attendance_summary", "fix": "security_invoker=true, rename date to attendance_date"}');

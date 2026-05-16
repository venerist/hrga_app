-- =============================================
-- FIX ATTENDANCE SUMMARY VIEW & SECURITY
-- =============================================

-- 1. Perbaiki peringatan keamanan view
-- Mengubah view dari SECURITY DEFINER ke SECURITY INVOKER.
-- Ini memastikan kebijakan RLS tetap berlaku bagi user yang memanggil view tersebut.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'attendance_summary' AND schemaname = 'public') THEN
        ALTER VIEW public.attendance_summary SET (security_invoker = true);
    END IF;
END $$;

-- 2. Perbaiki mismatch kolom (date -> attendance_date)
-- Kode repository dan service mengharapkan kolom 'attendance_date'.
-- Jika view saat ini masih menggunakan nama 'date', kita ubah namanya agar sinkron.
DO $$ 
BEGIN
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

-- 3. Audit Log
-- Mencatat tindakan perbaikan database ke tabel audit_logs.
INSERT INTO audit_logs (action, metadata)
VALUES (
  'attendance_summary_view_fixed', 
  jsonb_build_object(
    'security_fixed', true,
    'column_renamed', true,
    'applied_at', now()
  )
);

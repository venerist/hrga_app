-- =============================================
-- FIX: RENAME DATE TO ATTENDANCE_DATE
-- To avoid reserved keyword issues and maintain consistency
-- =============================================

-- 1. attendance_summary
alter table attendance_summary rename column "date" to attendance_date;

-- 2. attendance_overrides
alter table attendance_overrides rename column "date" to attendance_date;

-- 3. national_holidays (also uses date)
-- Keep as 'date' or rename? Let's keep as 'date' for holidays but rename for attendance to be consistent.
-- Actually, let's rename for consistency across the board.
alter table national_holidays rename column "date" to holiday_date;

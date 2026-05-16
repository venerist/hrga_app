# Veneris HR — Enterprise HRIS Platform

## Vision

Veneris HR adalah platform Enterprise Human Resource Information System (HRIS) modern yang dibangun untuk mentransformasi proses HR tradisional menjadi sistem digital berbasis data, aman, scalable, dan efisien.

Tujuan utama platform ini adalah menciptakan:

* Centralized workforce management
* Secure enterprise authentication
* Real-time attendance monitoring
* Automated payroll ecosystem
* Data-driven HR analytics
* Scalable SaaS architecture
* Operational efficiency for Indonesian companies

---

# Core Philosophy

Veneris HR BUKAN sekadar aplikasi absensi atau administrasi karyawan biasa.

Platform ini dirancang sebagai:

> “Enterprise Workforce Intelligence Platform”

Artinya:

* seluruh data HR menjadi terintegrasi,
* seluruh proses administratif menjadi otomatis,
* seluruh pengambilan keputusan menjadi berbasis data.

---

# PRIMARY DEVELOPMENT GOALS

## 1. Enterprise-Grade Architecture

Project harus selalu mempertahankan:

* Clean Architecture
* Service Repository Pattern
* Modular structure
* Reusable components
* Separation of concerns
* Scalable folder structure

JANGAN membuat struktur monolithic spaghetti code.

---

## 2. Security First

Security adalah prioritas utama.

WAJIB mempertahankan:

* Supabase SSR Authentication
* HTTP-only cookies
* Secure session handling
* Protected routes
* Role-Based Access Control (RBAC)
* Middleware validation
* Audit logging capability

---

## 3. Single Source of Truth

Seluruh data utama wajib berasal dari database utama Supabase/PostgreSQL.

TIDAK BOLEH:

* hardcoded employee data,
* duplicate business logic,
* multiple conflicting attendance sources.

Semua modul harus terhubung secara konsisten.

---

## 4. Real-Time Operational Visibility

Dashboard harus memberikan:

* real-time attendance,
* payroll overview,
* employee statistics,
* operational alerts,
* department analytics.

UI harus terasa:

* executive,
* modern,
* analytical,
* responsive.

---

# TECHNOLOGY STACK

## Frontend

* Next.js App Router
* TypeScript
* TailwindCSS
* Shadcn/UI
* Framer Motion

## Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Edge Functions (optional)

## Deployment

* Vercel

## Architecture

* Service Layer
* Repository Layer
* Modular Domain Structure

---

# DESIGN DIRECTION

## UI Style

Gunakan desain:

* clean enterprise SaaS,
* modern dashboard aesthetic,
* premium minimalist layout,
* glassmorphism ringan,
* soft shadow,
* responsive design.

Inspirasi:

* Linear
* Stripe
* Notion
* Deel
* Rippling
* BambooHR

---

# MANDATORY SYSTEM MODULES

## Employee Management

* CRUD employee
* Organizational hierarchy
* Contract tracking
* Employee documents

## Attendance System

* GPS attendance
* Camera verification
* Device binding
* Shift management
* Real-time monitoring

## Payroll

* Automatic payroll calculation
* Attendance integration
* Payslip export PDF
* Overtime calculation

## Leave Management

* Leave quota
* Approval workflow
* Calendar integration

## Analytics

* Attendance trends
* Department comparison
* HR operational insight
* Executive dashboard

---

# NON-NEGOTIABLE RULES (DO NOT CHANGE)

## DO NOT REMOVE

### Authentication Architecture

JANGAN mengganti:

* Supabase SSR Auth
* HTTP-only cookie flow
* secure middleware validation

### RBAC System

JANGAN menghapus:

* role validation,
* permission checks,
* protected menu system.

### Database Integrity

JANGAN:

* membuat duplicate tables tanpa alasan,
* menyimpan business logic di frontend,
* memindahkan source of truth keluar dari database utama.

### Clean Architecture

JANGAN:

* mencampur API logic dengan UI,
* membuat file monster besar,
* hardcode query langsung di component.

### Security Layer

JANGAN:

* expose sensitive keys,
* bypass middleware,
* disable validation,
* store secrets di frontend.

---

# PERFORMANCE REQUIREMENTS

System harus:

* lightweight,
* scalable,
* optimized,
* mobile responsive,
* production ready.

Gunakan:

* lazy loading,
* pagination,
* server-side rendering,
* optimized database query.

---

# FUTURE SCALABILITY

Platform harus siap berkembang menjadi:

* Multi-company HRIS
* SaaS subscription model
* Mobile application
* AI HR analytics
* Employee self-service ecosystem
* Recruitment management
* KPI performance system
* Asset management
* GA ticketing system

---

# DEVELOPMENT PRIORITIES

Urutan prioritas pengembangan:

1. Authentication & Security
2. Database Stability
3. Employee Master Data
4. Attendance Engine
5. Payroll Automation
6. Dashboard Analytics
7. Mobile Optimization
8. AI & Advanced Analytics

---

# FINAL OBJECTIVE

Veneris HR harus berkembang menjadi:

> Enterprise-grade Indonesian HR Operating System

yang:

* scalable,
* secure,
* maintainable,
* data-driven,
* dan siap digunakan perusahaan skala besar.

Bukan sekadar dashboard HR biasa.

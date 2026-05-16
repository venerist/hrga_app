export interface Employee {
  id: string;
  nik: string;
  name: string;
  division: string | null;
  position: string | null;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

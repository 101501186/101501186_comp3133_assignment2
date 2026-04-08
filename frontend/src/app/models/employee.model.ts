export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  profile_picture?: string | null;
  gender?: string | null;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
}

export interface EmployeeFormValue {
  first_name: string;
  last_name: string;
  email?: string | null;
  profile_picture?: string | null;
  gender?: string | null;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  type: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}
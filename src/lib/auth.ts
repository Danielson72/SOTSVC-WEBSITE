import { supabase } from './supabase';
import { getAuthErrorMessage } from './auth/errors';

export type SignUpData = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export async function signUp({ email, password, fullName, phone }: SignUpData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        },
        emailRedirectTo: `${window.location.origin}/verify?email=${encodeURIComponent(email)}`
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign up failed');

    return authData;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function signIn({ email, password }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}
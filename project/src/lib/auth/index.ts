import { supabase } from '../supabase';
import { getAuthErrorMessage } from './errors';
import { validateEmail, validatePassword, validatePhone } from '../validation/auth';

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
  // Validate inputs
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new Error(emailValidation.message);
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.message);
  }

  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.valid) {
    throw new Error(phoneValidation.message);
  }

  try {
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('This email is already registered. Please sign in instead.');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
        emailRedirectTo: 'https://sotsvc.com/sign-in'
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign up failed. Please try again.');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          full_name: fullName,
          phone,
          email
        }
      ]);

    if (profileError) {
      await supabase.auth.signOut();
      throw new Error('Failed to create profile. Please try again.');
    }

    return authData;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function signIn({ email, password }: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Invalid email or password. Please try again.');
      }
      throw error;
    }

    return data;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}
import { supabase } from './client';

import * as StrapiAuth from '../strapi/auth';

export const signUp = StrapiAuth.signUp;
export const signIn = StrapiAuth.signIn;
export const signOut = StrapiAuth.signOut;
export const getCurrentUser = StrapiAuth.getCurrentUser;

// Implement wrappers or throw errors for functions not yet supported in Strapi/Client-side
export async function getCurrentProfile() {
  // Mock profile or fetch from Strapi if needed
  const user = await getCurrentUser();
  if (!user) return null;
  return { ...user, role: { name: 'Member' } }; // Basic mock
}

export async function resetPassword(email: string) {
  console.warn('Reset password not fully implemented for Strapi yet');
}

export async function updatePassword(newPassword: string) {
  console.warn('Update password not fully implemented for Strapi yet');
}

export async function updateProfile(updates: any) {
  console.warn('Update profile not fully implemented for Strapi yet');
  return null;
}

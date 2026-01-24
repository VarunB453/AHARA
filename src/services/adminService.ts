import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Check if the current user is an admin
 */
export const checkIsAdmin = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data?.is_admin || false;
};

/**
 * Get all users (profiles)
 * Admin only
 */
export const getAllUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

  return data as Profile[];
};

/**
 * Delete a user by ID
 * Admin only
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('admin_delete_user', {
    target_user_id: userId
  });

  if (error) {
    console.error('Error deleting user:', error);
    throw new Error(error.message);
  }
};

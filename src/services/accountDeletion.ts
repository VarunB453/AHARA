import { supabase } from '@/integrations/supabase/client';

export interface DeleteAccountResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Comprehensive account deletion service
 * This handles account deletion via the secure database function 'delete_own_account'
 * which automatically handles cascading deletes of profiles, favorites, and other related data.
 */
export class AccountDeletionService {
  
  /**
   * Main account deletion function
   * @param userId - The ID of the user to delete (used for logging/verification, though RPC uses auth context)
   * @param reason - Optional reason for deletion
   */
  static async deleteAccount(userId: string, reason?: string): Promise<DeleteAccountResult> {
    try {
      console.log(`Starting account deletion for user: ${userId}`);

      // Optional: Log the reason if needed
      if (reason) {
        console.log('Deletion reason:', reason);
      }

      // Call the secure database function
      // This function:
      // 1. Checks authentication
      // 2. Deletes the user from auth.users
      // 3. Triggers cascading deletes for profile, favorites, etc.
      const { error } = await supabase.rpc('delete_own_account');

      if (error) {
        console.error('Error deleting account:', error);
        return {
          success: false,
          error: error.message,
          message: 'Failed to delete account. Please try again.'
        };
      }

      return {
        success: true,
        message: 'Your account has been successfully deleted.'
      };
    } catch (error: any) {
      console.error('Unexpected error during account deletion:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
        message: 'An unexpected error occurred. Please contact support.'
      };
    }
  }
}

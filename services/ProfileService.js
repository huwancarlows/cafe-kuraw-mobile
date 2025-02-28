// services/ProfileService.js
import { supabase } from '../lib/supabase';

// Fetch user profile by email for manual authentication
export const getProfileByEmail = async (email) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error fetching profile:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error fetching profile:', error.message);
        return null;
    }
};

// Update user profile
export const updateProfile = async (userId, profileData) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId);

        if (error) {
            console.error('Error updating profile:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error updating profile:', error.message);
        return null;
    }
};

// Create a new profile (if not using Supabase triggers)
export const createProfile = async (profileData) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([profileData]);

        if (error) {
            console.error('Error creating profile:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error creating profile:', error.message);
        return null;
    }
};

// Delete user profile
export const deleteProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error('Error deleting profile:', error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error deleting profile:', error.message);
        return null;
    }
};

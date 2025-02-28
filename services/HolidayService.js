// services/HolidayService.js
import { supabase } from '../lib/supabase';

// Create a new holiday
export const createHoliday = async (holidayName, holidayDate) => {
    try {
        const { data, error } = await supabase
            .from('holidays')
            .insert([{ holiday_name: holidayName, holiday_date: holidayDate }]);

        if (error) {
            console.error('Error creating holiday:', error.message);
            return { success: false, message: error.message };
        }

        console.log('Holiday created:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error creating holiday:', err);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};

// Fetch all holidays
export const fetchHolidays = async () => {
    try {
        const { data, error } = await supabase
            .from('holidays')
            .select('*')
            .order('holiday_date', { ascending: true });

        if (error) {
            console.error('Error fetching holidays:', error.message);
            return [];
        }

        console.log('Fetched holidays:', data);
        return data;
    } catch (err) {
        console.error('Unexpected error fetching holidays:', err);
        return [];
    }
};

// Update a holiday by ID
export const updateHoliday = async (holidayId, holidayName, holidayDate) => {
    try {
        const { data, error } = await supabase
            .from('holidays')
            .update({ holiday_name: holidayName, holiday_date: holidayDate })
            .eq('id', holidayId);

        if (error) {
            console.error('Error updating holiday:', error.message);
            return { success: false, message: error.message };
        }

        console.log('Holiday updated:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error updating holiday:', err);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};

// Delete a holiday by ID
export const deleteHoliday = async (holidayId) => {
    try {
        const { data, error } = await supabase
            .from('holidays')
            .delete()
            .eq('id', holidayId);

        if (error) {
            console.error('Error deleting holiday:', error.message);
            return { success: false, message: error.message };
        }

        console.log('Holiday deleted:', data);
        return { success: true, data };
    } catch (err) {
        console.error('Unexpected error deleting holiday:', err);
        return { success: false, message: 'An unexpected error occurred.' };
    }
};

import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state setup
const initialState = [];

// AsyncStorage save function
const saveSchedulesToStorage = async (schedules) => {
    try {
        await AsyncStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (error) {
        console.error('Failed to save schedules to AsyncStorage', error);
    }
};

// Load schedules from AsyncStorage
const loadSchedulesFromStorage = async () => {
    try {
        const schedules = await AsyncStorage.getItem('schedules');
        return schedules ? JSON.parse(schedules) : [];
    } catch (error) {
        console.error('Failed to load schedules from AsyncStorage', error);
        return [];
    }
};

// Schedule Slice
const scheduleSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        // Action to set schedules
        setSchedules: (state, action) => {
            return action.payload;
        },
        // Action to add a new schedule
        addSchedule: (state, action) => {
            const newSchedule = action.payload;
            state.push(newSchedule);
            saveSchedulesToStorage(state); // Persist new schedule in AsyncStorage
        },
        // Action to update an existing schedule
        updateSchedule: (state, action) => {
            const updatedSchedule = action.payload;
            const index = state.findIndex((schedule) => schedule.id === updatedSchedule.id);
            if (index !== -1) {
                state[index] = updatedSchedule;
                saveSchedulesToStorage(state); // Persist updated schedule in AsyncStorage
            }
        },
        // Action to delete a schedule
        deleteSchedule: (state, action) => {
            const id = action.payload;
            const updatedSchedules = state.filter((schedule) => schedule.id !== id);
            return updatedSchedules;
        },
    },
});

// Export actions
export const { setSchedules, addSchedule, updateSchedule, deleteSchedule } = scheduleSlice.actions;

// Load schedules from AsyncStorage when the app starts
export const loadSchedules = () => async (dispatch) => {
    const schedules = await loadSchedulesFromStorage();
    dispatch(setSchedules(schedules)); // Dispatch the loaded schedules to the store
};

// Reducer export
export default scheduleSlice.reducer;

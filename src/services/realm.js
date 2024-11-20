import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a schedule
export const saveScheduleToStorage = async (schedule) => {
    try {
        const storedSchedules = await AsyncStorage.getItem('schedules');
        let schedules = storedSchedules ? JSON.parse(storedSchedules) : [];
        schedules.push(schedule);
        await AsyncStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (error) {
        console.error('Error saving schedule to storage:', error);
    }
};

// Load schedules from AsyncStorage
export const loadSchedulesFromStorage = async () => {
    try {
        const storedSchedules = await AsyncStorage.getItem('schedules');
        return storedSchedules ? JSON.parse(storedSchedules) : [];
    } catch (error) {
        console.error('Error loading schedules from storage:', error);
        return [];
    }
};

// Delete a schedule from AsyncStorage
export const deleteScheduleFromStorage = async (id) => {
    try {
        const storedSchedules = await AsyncStorage.getItem('schedules');
        let schedules = storedSchedules ? JSON.parse(storedSchedules) : [];
        schedules = schedules.filter((schedule) => schedule.id !== id); // Remove the schedule with the matching ID
        await AsyncStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (error) {
        console.error('Error deleting schedule from storage:', error);
    }
};

// Update a schedule in AsyncStorage
export const updateScheduleInStorage = async (id, updatedSchedule) => {
    try {
        const storedSchedules = await AsyncStorage.getItem('schedules');
        let schedules = storedSchedules ? JSON.parse(storedSchedules) : [];
        schedules = schedules.map((schedule) =>
            schedule.id === id ? updatedSchedule : schedule
        );
        await AsyncStorage.setItem('schedules', JSON.stringify(schedules));
    } catch (error) {
        console.error('Error updating schedule in storage:', error);
    }
};

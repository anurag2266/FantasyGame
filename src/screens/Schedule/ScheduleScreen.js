import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Modal, Button, Alert, TextInput, Touchable, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setMatches, deleteMatch, addMatch, updateMatch } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarComponent from '../../components/calendar/CalendarComponent';
import CustomButton from '../../components/Button/CustomButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ScheduleScreen = () => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [timeSlotType, setTimeSlotType] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [scheduleToEdit, setScheduleToEdit] = useState(null);
    const matches = useSelector((state) => state.matches);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadMatchesFromStorage = async () => {
            const savedMatches = await AsyncStorage.getItem('matches');
            if (savedMatches) {
                dispatch(setMatches(JSON.parse(savedMatches)));
            }
        };
        loadMatchesFromStorage();
    }, [dispatch]);

    const handleSave = async () => {
        const newSchedule = { id: Date.now(), dates: selectedDates, startTime, endTime };
        setSchedules([...schedules, newSchedule]);
        setSelectedDates([]);
        setStartTime(null);
        setEndTime(null);
        await AsyncStorage.setItem('matches', JSON.stringify(matches));
        Alert.alert('Success', 'Schedule saved successfully!');
    };

    const handleAddSchedule = () => {
        const newSchedule = { id: Date.now(), dates: selectedDates, startTime, endTime };
        setSchedules([...schedules, newSchedule]);
        setSelectedDates([]);
        setStartTime(null);
        setEndTime(null);
    };

    const confirmDelete = (scheduleId) => {
        setScheduleToDelete(scheduleId);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (scheduleToDelete) {
            const newSchedules = schedules.filter(schedule => schedule.id !== scheduleToDelete);
            setSchedules(newSchedules);
            setShowDeleteModal(false);
            Alert.alert('Success', 'Schedule deleted successfully!');
        }
    };

    const handleTimePicker = (type) => {
        setTimeSlotType(type);
        setShowTimePicker(true);
    };

    const handleTimeConfirm = (date) => {
        if (timeSlotType === 'start') {
            setStartTime(date);
        } else if (timeSlotType === 'end') {
            setEndTime(date);
        }
        setShowTimePicker(false);
    };

    const handleEditSchedule = () => {
        if (!scheduleToEdit) {
            console.error("No schedule selected for editing.");
            return; // Exit early if no schedule is selected
        }

        const updatedSchedules = schedules.map(schedule => {
            if (schedule.id === scheduleToEdit.id) {
                return {
                    ...schedule,
                    dates: selectedDates,
                    startTime,
                    endTime,
                };
            }
            return schedule;
        });

        setSchedules(updatedSchedules);
        setScheduleToEdit(null); // Clear editing state
        setStartTime(null); // Clear start time
        setEndTime(null); // Clear end time
    };


    const getDuration = (startTime, endTime) => {
        const start = new Date(`1970-01-01T${startTime}:00Z`);
        const end = new Date(`1970-01-01T${endTime}:00Z`);
        const duration = (end - start) / (1000 * 60 * 60);
        return duration;
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };


    const renderScheduleItem = ({ item }) => {
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);
        const formattedStartTime = formatTime(start);
        const formattedEndTime = formatTime(end);

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('en-US', options); // Example: "November 20, 2024"
        };

        // Extract and format the dates from item.dates
        const formattedDates = item.dates.map(dateObj => {
            const dateKey = Object.keys(dateObj)[0]; // Extract the date string
            return formatDate(dateKey); // Format the date
        });

        const duration = ((end - start) / (1000 * 60 * 60)).toFixed(2); // Hours as a decimal

        return (
            <View style={styles.scheduleItem}>
                <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleItemText}>{`📅 Dates: ${formattedDates.join(', ')}`}</Text>
                    <Text style={styles.scheduleItemText}>{`⏰ Time: ${formattedStartTime} - ${formattedEndTime} (${duration} hours)`}</Text>
                </View>
                <View style={styles.scheduleItemActions}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Setting schedule to edit:", item);
                            setScheduleToEdit(item);
                            setSelectedDates(item.dates);
                            setStartTime(item.startTime);
                            setEndTime(item.endTime);
                        }}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Image source={require('../../assets/images/editing.png')} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => confirmDelete(item.id)}
                        style={styles.iconButton}
                        activeOpacity={0.7}
                    >
                        <Image source={require('../../assets/images/delete.png')} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    };

    const formatTime2 = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }); // Example: "09:05 PM"
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }); // Example: "November 19, 2024"
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <CalendarComponent
                    onDateSelect={(date) => setSelectedDates([...selectedDates, date])}
                    selectedDates={selectedDates}
                />

                <View style={styles.timeSlotContainer}>
                    <CustomButton
                        title={startTime ? `${formatTime(startTime)} on ${formatDate(startTime)}` : 'Select Start Time'}
                        onPress={() => handleTimePicker('start')}
                        style={styles.timeButton}
                        textStyle={styles.timeButtonText}
                    />
                    <CustomButton
                        title={endTime ? `${formatTime(endTime)} on ${formatDate(endTime)}` : 'Select End Time'}
                        onPress={() => handleTimePicker('end')}
                        style={styles.timeButton}
                        textStyle={styles.timeButtonText}
                    />
                </View>

                {scheduleToEdit && (
                    <View style={styles.editSection}>
                        <CustomButton
                            title="Save Changes"
                            onPress={handleEditSchedule}
                            style={styles.saveButton}
                            textStyle={styles.saveButtonText}
                        />
                    </View>
                )}
            </ScrollView>

            <CustomButton
                title="Save Schedule"
                onPress={handleSave}
                style={styles.saveButton}
                textStyle={styles.saveButtonText}
            />

            <FlatList
                data={schedules}
                renderItem={renderScheduleItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.scheduleList}
            // ListEmptyComponent={<Text>No schedules found.</Text>}
            />

            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Are you sure you want to delete this schedule?</Text>
                        <View style={styles.modalButtons}>
                            <CustomButton title="Cancel" onPress={() => setShowDeleteModal(false)} />
                            <CustomButton title="Delete" onPress={handleDelete} />
                        </View>
                    </View>
                </View>
            </Modal>

            <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setShowTimePicker(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    scrollViewContainer: {
        paddingBottom: 20,
    },
    saveButton: {
        backgroundColor: '#3b3b3b',
        padding: 12,
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    timeSlotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeButton: {
        backgroundColor: '#071b5e',
        padding: 12,
        flex: 1,
        marginRight: 10,
    },
    timeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    scheduleList: {
        marginTop: 20,
    },
    editButton: {
        backgroundColor: '#007BFF',
        padding: 8,
    },
    deleteButton: {
        backgroundColor: '#FF5733',
        padding: 8,
    },
    editSection: {
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    scheduleItem: {
        backgroundColor: '#f9f9f9', // Light background
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000', // Subtle shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scheduleDetails: {
        marginBottom: 10,
    },
    scheduleItemText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    scheduleItemActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    iconButton: {
        alignItems: 'center',
    },
    iconImage: {
        width: 24,
        height: 24,
        // tintColor: '#007BFF', 
    },
    iconLabel: {
        fontSize: 12,
        color: '#007BFF', // Match icon color
        marginTop: 4,
        fontWeight: '600',
    },
});

export default ScheduleScreen;

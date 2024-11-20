import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomButton from '../../components/Button/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { addMatch, updateMatch, deleteMatch } from '../../redux/store';

const TimeSlotManager = ({ selectedDates }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [currentSlot, setCurrentSlot] = useState({ startTime: null, endTime: null, date: null });
    const [isStartTime, setIsStartTime] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);

    const timeSlots = useSelector((state) => state.matches);
    const dispatch = useDispatch();

    // Validate if the new slot overlaps with existing ones
    const validateSlot = (startTime, endTime, date) => {
        return !timeSlots.some(
            (slot) =>
                slot.date === date &&
                ((startTime >= slot.startTime && startTime < slot.endTime) || (endTime > slot.startTime && endTime <= slot.endTime))
        );
    };

    const handleTimeConfirm = (selectedTime) => {
        setPickerVisible(false);
        if (isStartTime) {
            setCurrentSlot({ ...currentSlot, startTime: selectedTime });
            setIsStartTime(false); // Move to end time selection
        } else {
            const newSlot = { ...currentSlot, endTime: selectedTime };

            // Validate the slot for overlapping
            if (!validateSlot(newSlot.startTime, newSlot.endTime, currentSlot.date)) {
                Alert.alert('Invalid Slot', 'Time slots cannot overlap.');
                return;
            }

            if (editingIndex !== null) {
                dispatch(updateMatch(newSlot));
                setEditingIndex(null);
            } else {
                dispatch(addMatch(newSlot));
            }

            setCurrentSlot({ startTime: null, endTime: null, date: null });
            setIsStartTime(true); // Reset to start time for next addition
        }
    };

    const handleEditSlot = (index) => {
        setEditingIndex(index);
        setCurrentSlot(timeSlots[index]);
        setIsStartTime(true);
        setPickerVisible(true); // Open picker for start time
    };

    const handleDeleteSlot = (index) => {
        Alert.alert('Delete Slot', 'Are you sure you want to delete this slot?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => dispatch(deleteMatch(timeSlots[index].id)),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <CustomButton
                title="Add Time Slot"
                onPress={() => {
                    setPickerVisible(true); // Open picker for start time
                    setCurrentSlot({ startTime: null, endTime: null, date: null });
                }}
                style={{ backgroundColor: '#28A745' }}
                textStyle={{ fontSize: 18 }}
            />
            <FlatList
                data={timeSlots}
                // keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}  {/* Fallback to index */}
                renderItem={({ item, index }) => (
                    <View style={styles.slotContainer}>
                        <Text style={styles.slotText}>
                            {/* {`Date: ${item.date} - Start: ${item.startTime} - End: ${item.endTime}`} */}
                        </Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => handleEditSlot(index)}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteSlot(index)}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="time"
                date={new Date()}
                onConfirm={handleTimeConfirm}
                onCancel={() => setPickerVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    slotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    slotText: {
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
    },
    editText: {
        marginRight: 10,
        color: 'blue',
    },
    deleteText: {
        color: 'red',
    },
});

export default TimeSlotManager;

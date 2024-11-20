import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomButton from '../Button/CustomButton';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const CalendarComponent = ({ onDateSelect, selectedDates }) => {
    const [markedDates, setMarkedDates] = useState(selectedDates || {});

    // const handleDayPress = (day) => {
    //     const date = day.dateString;
    //     const updatedDates = {
    //         ...markedDates,
    //         [date]: { selected: true, selectedColor: '#071b5e' }
    //     };
    //     setMarkedDates(updatedDates);
    //     onDateSelect(updatedDates);
    // };

    const handleDayPress = (day) => {
        const date = day.dateString;

        // Toggle selection: Add or remove the date
        const updatedDates = { ...markedDates };
        if (updatedDates[date]) {
            delete updatedDates[date]; // Deselect if already selected
        } else {
            updatedDates[date] = { selected: true, selectedColor: '#071b5e' }; // Select if not selected
        }

        setMarkedDates(updatedDates);
        onDateSelect(updatedDates);
    };


    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={handleDayPress}
                markedDates={markedDates}
                markingType="simple"
            />
            <CustomButton
                title="Select All Days"
                onPress={() => {
                    const allDays = {};
                    const today = new Date();
                    for (let i = 1; i <= 30; i++) {
                        const date = new Date(today.getFullYear(), today.getMonth(), i).toISOString().split('T')[0];
                        allDays[date] = { selected: true };
                    }
                    setMarkedDates(allDays);
                    onDateSelect(allDays);
                }}
                style={{ backgroundColor: '#3b3b3b', }}
                textStyle={{ fontSize: 18, color: "#fff" }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, },
});

export default CalendarComponent;

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

// CustomButton component
const CustomButton = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    loading = false,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, style, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled || loading}>
            <View style={styles.buttonContent}>
                {loading ? (
                    <Text style={[styles.text, textStyle]}>Loading...</Text>
                ) : (
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

// Styles for the button
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    disabled: {
        backgroundColor: '#B0BEC5', // Greyed out color for disabled button
    },
});

export default CustomButton;

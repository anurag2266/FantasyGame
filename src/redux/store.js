import { configureStore, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Match slice setup
const matchSlice = createSlice({
    name: 'matches',
    initialState: [],
    reducers: {
        setMatches: (state, action) => action.payload,
        addMatch: (state, action) => {
            state.push(action.payload);
        },
        updateMatch: (state, action) => {
            const index = state.findIndex((match) => match.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        deleteMatch: (state, action) => {
            return state.filter((match) => match.id !== action.payload);
        },
    },
});

// AsyncStorage Save Function
const saveMatches = async (matches) => {
    await AsyncStorage.setItem('matches', JSON.stringify(matches));
};

// Store configuration
const store = configureStore({
    reducer: {
        matches: matchSlice.reducer,
    },
});

store.subscribe(() => {
    const state = store.getState();
    saveMatches(state.matches);
});

export const { setMatches, addMatch, updateMatch, deleteMatch } = matchSlice.actions;
export default store;

import { createSlice } from '@reduxjs/toolkit';

const initialState =
{
	history: []
};

const historySlice = createSlice
(
	{
		name: 'history',
		initialState,
		reducers: 
		{
			addConversionToHistory: (state, action) =>
			{
				const newConversion = { ...action.payload, id: Date.now() + Math.random() };
				state.history.unshift(newConversion);
				if (state.history.length > 5) { state.history.pop(); }
			}
		}
	}
)

export const { addConversionToHistory } = historySlice.actions;
export default historySlice.reducer;
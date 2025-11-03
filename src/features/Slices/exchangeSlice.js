import { createSlice } from '@reduxjs/toolkit';

import exchangeAsyncThunk from '../AsyncThunks/exchangeAsyncThunk';

const initialState =
{
	exchangeRates: {},
	status: 'idle',
	error: null,
	lastUpdatedTime: null
};

const exchangeSlice = createSlice
(
	{
		name: 'exchange',
		initialState,
		reducers: {},
		extraReducers: (builder) =>
		{
			builder
				.addCase
				(
					exchangeAsyncThunk.pending,
					state =>
					{
						state.status = 'loading';
						state.error = null;
					}
				)
				.addCase
				(
					exchangeAsyncThunk.fulfilled,
					(state, action) =>
					{
						state.status = 'succeeded';
						if (action.payload && action.payload.conversion_rates) { state.exchangeRates = action.payload.conversion_rates; }
						state.lastUpdatedTime = new Date().toISOString();
					}
				)
				.addCase
				(
					exchangeAsyncThunk.rejected,
					(state, action) =>
					{
						state.status = 'failed';
						state.error = action.payload || action.error.message || "Failed to fetch exchange rates";
					}
				);
		}
	}
)

export default exchangeSlice.reducer;
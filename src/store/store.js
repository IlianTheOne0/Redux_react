import { configureStore } from '@reduxjs/toolkit';

import exchangeReducer from '../features/Slices/exchangeSlice';

const store = configureStore
(
	{
		reducer:
		{
			exchange: exchangeReducer
		}
	}
);

export default store;
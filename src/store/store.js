import { configureStore } from '@reduxjs/toolkit';

import exchangeReducer from '../features/Slices/exchangeSlice';
import historyReducer from '../features/Slices/historySlice';

const store = configureStore
(
	{
		reducer:
		{
			exchange: exchangeReducer,
			history: historyReducer
		}
	}
);

export default store;
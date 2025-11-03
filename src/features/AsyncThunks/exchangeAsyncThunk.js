import { createAsyncThunk } from '@reduxjs/toolkit';

import apiConfig from '../../.config/api.json';

const exchangeAsyncThunk = createAsyncThunk
(
	'exchange/fetchExchangeRates',
	async (base) =>
	{
		try
		{
			const response = await fetch(`${apiConfig.API_URL}/${apiConfig.API_KEY}/latest/${base}`);
			if (!response.ok) { throw new Error('Server responded with an error'); }
			
			const data = await response.json();
			if (data.error) { throw new Error(data.error); }
			console.log(response, data);
			return data;
		}
		catch (error) { return Promise.reject(error.message); }
	}
);

export default exchangeAsyncThunk;
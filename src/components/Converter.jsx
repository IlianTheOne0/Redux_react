import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import exchangeAsyncThunk from "../features/AsyncThunks/exchangeAsyncThunk";

import "../styles/Converter.css";

const currencies = ["USD", "EUR", "PLN"];

function Converter()
{
	const dispatch = useDispatch();

	const rates = useSelector((state) => state.exchange.exchangeRates);
	const status = useSelector((state) => state.exchange.status);
	const error = useSelector((state) => state.exchange.error);

	const [uahAmount, setUahAmount] = useState("100");
	const [selectedCurrency, setSelectedCurrency] = useState("USD");

	useEffect(() => { dispatch(exchangeAsyncThunk("UAH")); }, [dispatch]);

	const calculatedResult = useMemo
	(
		() =>
		{
			if (status !== "succeeded" || !rates) { return null; }

			const amount = parseFloat(uahAmount) || 0;
			if (amount <= 0) { return 0; }

			const rate = rates[selectedCurrency];
			if (!rate) { return null; }
			return (amount * rate).toFixed(4);
		},
		[uahAmount, rates, status, selectedCurrency]
	);

	const handleAmountChange = (event) => { setUahAmount(event.target.value); };
	const handleCurrencyChange = (event) => { setSelectedCurrency(event.target.value); };

	let content;
	switch (status)
	{
		case "loading": { content = <p>Loading exchange rates...</p>; } break;
		case "failed": { content = <p>Error: {error}</p>; } break;
		case "succeeded":
		{
			const currentRate = rates[selectedCurrency];

			const displayAmount = uahAmount === "" ? "0" : uahAmount;

			content =
			(
				<div className="conversion-result">
					<p>Amount in UAH: {displayAmount}</p>
					<p>Converted amount: {calculatedResult || "0"} {selectedCurrency}</p>
					<p>1 UAH = {currentRate.toFixed(6)} {selectedCurrency}</p>
				</div>
			)
		}
	}

	return (
		<section className="currency_converter-section">
			<h2>Currency Converter (to UAH)</h2>

			<div>
				<label htmlFor="uah-input">Amount in UAH:</label>
				{"    "}
				<input id="uah-input" type="number" value={uahAmount} onChange={handleAmountChange} placeholder="Enter the amount"/>
			</div>

			<div>
				<label htmlFor="currency-select">Select currency:</label>
				{"    "}
				<select id="currency-select" value={selectedCurrency} onChange={handleCurrencyChange} disabled={status !== "succeeded"}>
					<option value="" disabled hidden>{status === "loading" ? "Loading..." : "Select a currency"}</option>
					{
						currencies.map
						(
							currency =>(<option key={currency} value={currency}>{currency}</option>)
						)
					}
				</select>
			</div>

			{content}
		</section>
	);
}

export default Converter;
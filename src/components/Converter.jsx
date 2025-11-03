import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import exchangeAsyncThunk from "../features/AsyncThunks/exchangeAsyncThunk";
import { addConversionToHistory } from "../features/Slices/historySlice";

import "../styles/Converter.css";

const currencies = ["USD", "EUR", "PLN"];

function Converter()
{
	const dispatch = useDispatch();

	const rates = useSelector((state) => state.exchange.exchangeRates);
	const status = useSelector((state) => state.exchange.status);
	const error = useSelector((state) => state.exchange.error);
	const lastUpdated = useSelector((state) => state.exchange.lastUpdatedTime);
	const history = useSelector((state) => state.history.history);
	
	const [uahAmount, setUahAmount] = useState("100");
	const [selectedCurrencies, setSelectedCurrencies] = useState(["USD"]);

	const amount = useMemo
	(
		() =>
		{
			const parsed = parseFloat(uahAmount);
			return isNaN(parsed) || parsed < 0 ? 0 : parsed;
		},
		[uahAmount]
	);

	useEffect
	(
		() =>
		{
			if (status === "succeeded" && amount > 0 && selectedCurrencies.length > 0)
			{
				selectedCurrencies.forEach
				(
					currency =>
					{
						const rate = rates[currency];
						if (!rate) { return; }

						const calculatedResult = (amount * rate).toFixed(4);

						const newConversion =
						{
							fromAmount: parseFloat(uahAmount),
							fromCurrency: "UAH",
							toAmount: parseFloat(calculatedResult),
							toCurrency: currency,
							rate: rate.toFixed(6),
							timestamp: new Date().toISOString()
						};

						dispatch(addConversionToHistory(newConversion));
					}
				)
			}
		},
		[selectedCurrencies, uahAmount]
	);

	useEffect
	(
		() =>
		{
			dispatch(exchangeAsyncThunk("UAH"));

			const intervalId = setInterval(() => { dispatch(exchangeAsyncThunk("UAH")); }, 60 * 1000);

			return () => { clearInterval(intervalId); };
		},
		[dispatch]
	);

	const handleAmountChange = (event) => { setUahAmount(event.target.value); };
	const handleCurrencyChange = (event) =>
	{
		const currency = event.target.value;
		const isChecked = event.target.checked;

		setSelectedCurrencies
		(
			previous =>
			{
				if (isChecked) { return [...previous, currency]; }
				else { return previous.filter(item => item !== currency); }
			}
		);
	};

	let content;
	switch (status)
	{
		case "loading": { content = <p>Loading exchange rates...</p>; } break;
		case "failed":
		{
			content = (
				<div className="error-div">
					<p>Error: {error}</p>
					<p>Please try again</p>
					<button className="retry-button" onClick={() => dispatch(exchangeAsyncThunk("UAH"))}>Retry</button>
				</div>
			);
		} break;
		case "succeeded":
		{
			const displayAmount = uahAmount === "" ? "0" : uahAmount;
			
			const results = selectedCurrencies.map
			(
				currency =>
				{
					const rate = rates[currency];
					let calculatedResult = null;
					if (rate && amount > 0) { calculatedResult = (amount * rate).toFixed(4); }

					const convertedDisplay = calculatedResult || "0";
					const currentRateDisplay = rate ? rate.toFixed(6) : "N/A";

					return (
						<div key={currency}>
							<p>1 UAH = {currentRateDisplay} {currency}</p>
							<p>{displayAmount} UAH = {convertedDisplay} {currency}</p>
						</div>
					);
				}
			);

			if (selectedCurrencies.length === 0) { content = <p>Please select at least one currency</p>; }
			else
			{
				content =
				(
					<div className="conversion-results">
						<h3>Conversion Results</h3>
						<p>Amount in UAH: {displayAmount}</p>
						{results}
					</div>
				)
			}
		} break;
		default: { content = null; }
	}

	const historyItems = 
	(
		<div className="history-list">
			<h3>Conversion History (last 5)</h3>
			{
				history.length === 0 ? 
				<p>No conversion history yet</p>
				:
				<ul>
					{
						history.map
						(
							item =>
							{
								const date = new Date(item.timestamp);
								return (
									<li key={item.id}>
										{item.fromAmount} {item.fromCurrency} =&gt; {item.toAmount} {item.toCurrency} | Rate: {item.rate} | {date.toLocaleString()}
									</li>
								);
							}
						)
					}
				</ul>
		}
		</div>
	)

	return (
		<section className="currency_converter-section">
			<h2>Currency Converter (to UAH)</h2>
			{lastUpdated && <p className="last-updated">Last updated: {Date(lastUpdated).toLocaleString()}</p>}

			<div>
				<label htmlFor="uah-input">Amount in UAH:</label>
				{"    "}
				<input id="uah-input" type="number" value={uahAmount} onChange={handleAmountChange} placeholder="Enter the amount"/>
			</div>

			<div className="currency-selection">
				<p>Select currencies:</p>
				<div className="checkbox-group">
					{
						currencies.map
						(
							currency =>
							(
								<span key={currency} className="checkbox-item">
									<input id={`currency-${currency}`} type="checkbox" value={currency} checked={selectedCurrencies.includes(currency)} onChange={handleCurrencyChange}/>
									<label htmlFor={`currency-${currency}`}>{currency}</label>
									{"    "}
								</span>
							)
						)
					}
				</div>
			</div>

			{content}

			<hr className="divider"/>

			{historyItems}
		</section>
	);
}

export default Converter;
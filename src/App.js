import { Provider } from "react-redux";

import store from "./store/store";

import Converter from "./components/Converter";

import "./styles/App.css";

function App()
{
	return (
		<Provider store={store}>
			<div className="App">
				<Converter/>
			</div>
		</Provider>
	)
}

export default App;
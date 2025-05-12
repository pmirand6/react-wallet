import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Home: React.FC = () => {
    const { state, dispatch } = useWallet();
    const [amount, setAmount] = useState<number>(state.eurAmount);
    const [selected, setSelected] = useState<string[]>(state.selectedCurrencies);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Inicio | Cartera Virtual';
    }, []);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions).map((opt) => opt.value);
        if (options.length > 3) {
            setError('Solo se pueden seleccionar hasta 3 divisas.');
        } else {
            setError(null);
            setSelected(options);
        }
    };

    const handleSubmit = () => {
        if (amount <= 0) {
            setError('El saldo en EUR debe ser mayor a 0.');
            return;
        }

        if (selected.length === 0) {
            setError('Debes seleccionar al menos una divisa.');
            return;
        }

        dispatch({ type: 'SET_AMOUNT', amount });
        dispatch({ type: 'SET_SELECTED_CURRENCIES', currencies: selected });
        navigate('/resultados');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Cartera Virtual</h1>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Saldo inicial en EUR:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Selecciona hasta 3 divisas:</label>
                    <select
                        multiple
                        size={6}
                        value={selected}
                        onChange={handleSelect}
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                    >
                        {state.availableCurrencies.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.id} - {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                {state.error && <p className="text-red-400 text-sm mb-2">{state.error}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition duration-200"
                >
                    Ver resultados
                </button>
            </div>
        </div>
    );
};

export default Home;

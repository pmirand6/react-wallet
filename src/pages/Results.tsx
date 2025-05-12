import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { fetchExchangeRates } from '../services/CurrencyService';
import { useNavigate } from 'react-router-dom';

const Results: React.FC = () => {
    const { state } = useWallet();
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Resultados | Cartera Virtual';
        if (state.eurAmount <= 0 || state.selectedCurrencies.length === 0) {
            navigate('/');
            return;
        }

        fetchExchangeRates('EUR')
            .then((res) => {
                setRates(res);
                setLoading(false);
            })
            .catch(() => {
                setError('No se pudieron cargar las tasas de cambio.');
                setLoading(false);
            });
    }, [state.eurAmount, state.selectedCurrencies, navigate]);

    if (loading) return <p className="text-white text-center mt-10">Cargando tasas de cambio...</p>;
    if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4 text-center">Resultados</h1>

                <p className="text-lg mb-4">
                    <strong>Saldo en EUR:</strong> €{state.eurAmount.toFixed(2)}
                </p>

                <h2 className="text-xl font-semibold mb-2">Equivalente en divisas</h2>
                <ul className="mb-6 space-y-2">
                    {state.selectedCurrencies.map((code) => {
                        const rate = parseFloat(rates[code]);
                        const converted = rate * state.eurAmount;

                        return (
                            <li key={code} className="bg-gray-700 p-3 rounded-md">
                                <span className="font-medium">{code}</span>: {converted.toFixed(2)}{' '}
                                <span className="text-sm text-gray-400">
                                    ({rate.toFixed(4)} por 1 EUR)
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <button
                    onClick={() => navigate('/')}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition duration-200"
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

export default Results;

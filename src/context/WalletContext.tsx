import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
} from 'react';
import {
    fetchCurrencies,
    type Currency,
} from '../services/CurrencyService';

import type { ReactNode } from 'react';

interface State {
    eurAmount: number;
    selectedCurrencies: string[];
    availableCurrencies: Currency[];
    exchangeRates: Record<string, string>;
    error: string | null;
}

type Action =
    | { type: 'SET_AMOUNT'; amount: number }
    | { type: 'SET_SELECTED_CURRENCIES'; currencies: string[] }
    | { type: 'LOAD_CURRENCIES_SUCCESS'; currencies: Currency[] }
    | { type: 'LOAD_CURRENCIES_ERROR'; error: string }
    | { type: 'LOAD_RATES_SUCCESS'; rates: Record<string, string> };

const initialState: State = {
    eurAmount: 0,
    selectedCurrencies: [],
    availableCurrencies: [],
    exchangeRates: {},
    error: null,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_AMOUNT':
            return { ...state, eurAmount: action.amount };
        case 'SET_SELECTED_CURRENCIES':
            return { ...state, selectedCurrencies: action.currencies };
        case 'LOAD_CURRENCIES_SUCCESS':
            return { ...state, availableCurrencies: action.currencies, error: null };
        case 'LOAD_CURRENCIES_ERROR':
            return { ...state, error: action.error };
        case 'LOAD_RATES_SUCCESS':
            return { ...state, exchangeRates: action.rates };
        default:
            return state;
    }
}

export const WalletContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        fetchCurrencies()
            .then((currencies) => {
                dispatch({ type: 'LOAD_CURRENCIES_SUCCESS', currencies });
            })
            .catch(() => {
                dispatch({ type: 'LOAD_CURRENCIES_ERROR', error: 'No se pudieron cargar las divisas' });
            });
    }, []);

    return (
        <WalletContext.Provider value={{ state, dispatch }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet debe usarse dentro del WalletProvider');
    }
    return context;
};

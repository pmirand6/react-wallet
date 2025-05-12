import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Results from '../Results';
import * as CurrencyService from '../../services/CurrencyService';
import { WalletContext } from '../../context/WalletContext'; // ✅ esta línea debe existir

const mockRates = {
    USD: '1.1',
    ARS: '900',
};

const mockState = {
    eurAmount: 100,
    selectedCurrencies: ['USD', 'ARS'],
    availableCurrencies: [],
    exchangeRates: {},
    error: null,
};

const mockDispatch = vi.fn();

const renderWithMockContext = () => {
    render(
        <WalletContext.Provider value={{ state: mockState, dispatch: mockDispatch }}>
            <MemoryRouter initialEntries={['/resultados']}>
                <Routes>
                    <Route path="/resultados" element={<Results />} />
                </Routes>
            </MemoryRouter>
        </WalletContext.Provider>
    );
};

describe('Results page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(CurrencyService, 'fetchExchangeRates').mockResolvedValue(mockRates);
    });

    it('muestra equivalencias de monedas seleccionadas', async () => {
        renderWithMockContext();

        await waitFor(() => {
            expect(screen.getByText(/Resultados/i)).toBeInTheDocument();
            expect(screen.getByText(/Saldo en EUR/i)).toBeInTheDocument();
            expect(screen.getByText(/USD:/i)).toBeInTheDocument();
            expect(screen.getByText(/ARS:/i)).toBeInTheDocument();
        });
    });
});

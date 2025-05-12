import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';
import { WalletProvider } from '../../context/WalletContext';
import * as CurrencyService from '../../services/CurrencyService';
import userEvent from '@testing-library/user-event';


const mockCurrencies = [
    { id: 'USD', name: 'US Dollar', min_size: '0.01' },
    { id: 'ARS', name: 'Argentine Peso', min_size: '1' },
    { id: 'BTC', name: 'Bitcoin', min_size: '0.00001' },
    { id: 'ETH', name: 'Ethereum', min_size: '0.0001' },
];

describe('Home page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(CurrencyService, 'fetchCurrencies').mockResolvedValue(mockCurrencies);
    });

    it('renderiza correctamente campos de ingreso y selección', async () => {
        render(
            <WalletProvider>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </WalletProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Cartera Virtual')).toBeInTheDocument();
            expect(screen.getByLabelText(/Saldo inicial en EUR/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/Selecciona hasta 3 divisas/i)).toBeInTheDocument();
        });
    });

    it('muestra error si se seleccionan más de 3 monedas', async () => {
        render(
            <WalletProvider>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </WalletProvider>
        );

        const select = await screen.findByLabelText(/Selecciona hasta 3 divisas/i);
        const user = userEvent.setup();

        // Seleccionar 4 monedas
        await user.selectOptions(select, ['USD', 'ARS', 'BTC', 'ETH']);

        expect(screen.getByText(/Solo se pueden seleccionar hasta 3/i)).toBeInTheDocument();
    });


    it('valida que el saldo sea mayor a 0', async () => {
        render(
            <WalletProvider>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </WalletProvider>
        );

        await waitFor(() => {
            const button = screen.getByText('Ver resultados');
            fireEvent.click(button);
            expect(screen.getByText(/El saldo en EUR debe ser mayor a 0/i)).toBeInTheDocument();
        });
    });
});

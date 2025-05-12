export interface Currency {
    id: string;
    name: string;
    min_size: string;
}

export async function fetchCurrencies(): Promise<Currency[]> {
    const res = await fetch('https://api.coinbase.com/v2/currencies');
    const data = await res.json();
    return data.data;
}

export async function fetchExchangeRates(base = 'EUR'): Promise<Record<string, string>> {
    const res = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${base}`);
    const data = await res.json();
    return data.data.rates;
}
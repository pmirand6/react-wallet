import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.tsx';
import './tailwind.css';
import {WalletProvider} from "./context/WalletContext.tsx";
import Results from "./pages/Results.tsx";
import './tailwind.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WalletProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/resultados" element={<Results />} />
                </Routes>
            </BrowserRouter>
        </WalletProvider>
    </React.StrictMode>,
);

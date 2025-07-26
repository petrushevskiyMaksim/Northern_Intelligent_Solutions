import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { githubApi } from './features/api/githubApi';
import App from './App';
import './index.scss';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApiProvider api={githubApi}>
            <App />
        </ApiProvider>
    </StrictMode>
);

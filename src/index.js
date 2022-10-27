import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CocktailProvider } from './context/useContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CocktailProvider>
      <App />
    </CocktailProvider>
  </React.StrictMode>
)



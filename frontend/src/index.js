import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import ShopContextProvider from './context/ShopContext';
import axios from 'axios'

const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL = "https://forever-backend-mauve.vercel.app";
root.render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>
);
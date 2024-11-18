import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import axios from "axios";

const root = createRoot(document.getElementById("root"))
axios.defaults.baseURL = "https://forever-backend-mauve.vercel.app";
  root.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>
);

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";
import { TokenProvider } from './contexts/login.jsx';
import ReactGA from 'react-ga';
import { root } from 'postcss';

const TRACKING_ID = 'G-BGCM0MH70E';

function initializeReactGA() {
  ReactGA.initialize(TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const Root = () => {
  useEffect(() => {
    initializeReactGA();
  }, []);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <TokenProvider>
        <App />
      </TokenProvider>
    </Router>
  );
};

export default root;

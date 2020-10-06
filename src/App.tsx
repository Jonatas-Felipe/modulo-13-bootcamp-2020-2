import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';

import GlobalStyles from './styles/global';
import Routes from './routes';

import AppProvider from './hooks';

const App: FC = () => (
  <BrowserRouter>
    <AppProvider>
        <Routes />
    </AppProvider>
    <GlobalStyles />
  </BrowserRouter>
);

export default App;

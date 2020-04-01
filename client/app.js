import React from 'react';

import {Navbar} from './components';
import Footer from './components/footer';
import Routes from './routes';
import {ToastContainer} from 'react-toastify';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;

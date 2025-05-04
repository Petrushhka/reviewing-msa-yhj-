import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import NaverMapComponent from './components/NaverMapComponent.jsx';
import { AuthContextProvider } from './context/UserContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AppRouter from './router/AppRouter.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthContextProvider>
      <div className='App'>
        <Header />
        <div className='content-wrapper'>
          <AppRouter />
        </div>
        <Footer />
      </div>
    </AuthContextProvider>
  );
}

export default App;

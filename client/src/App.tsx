import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TempHome from './components/TempHome';
import './App.css';
import { useEffect, useState } from 'react';
import { getCards } from './common/apiService';
import { cardType } from './types';
import Home from './components/Home/Home';
import EditProfile from './components/EditProfile/EditProfile';

export default function App() {
  const [cards, setCards] = useState<cardType[]>([]);
  const [error, setError] = useState(null);

  // get cards, set cards if success, otherwise set error
  useEffect(() => {
    getCards()
      .then((res) => {
        setCards(res);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/home' element={<TempHome cards={cards} />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/edit-profile' element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

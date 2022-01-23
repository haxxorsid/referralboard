import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import './App.css';
import { useEffect, useState } from 'react';
import { getCards } from './common/apiService';
import { cardType } from "./types";

export default function App() {
  const [cards, setCards] = useState<cardType[]>([])
  const [error, setError] = useState(null)

  // get cards, set cards if success, otherwise set error
  useEffect(() => {
    getCards()
      .then(res => {
        setCards(res);
      })
      .catch(error => {
        setError(error)
      })
  }, [])

  return (
    <Router>
      <div className="App">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Routes>
          <Route path="/" element={<Home cards={cards}/>} />
          <Route path="/about" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}


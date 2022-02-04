import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TempHome from './components/TempHome';
import './App.css';
import { useEffect, useState } from 'react';
import { getPosts } from './common/apiService';
import { postType } from './types';
import Home from './components/Home/Home';
import EditProfile from './components/EditProfile/EditProfile';

export default function App() {
  const [posts, setPosts] = useState<postType[]>([]);
  const [error, setError] = useState(null);

  // get cards, set cards if success, otherwise set error
  useEffect(() => {
    getPosts()
      .then((res) => {
        setPosts(res);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/home' element={<TempHome posts={posts} />} />
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/edit-profile' element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

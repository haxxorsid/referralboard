import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { useEffect } from 'react';
import { validateLogin } from './common/apiService';
import Home from './components/Home/Home';
import EditProfile from './components/EditProfile/EditProfile';
import { AuthProvider, useAuth } from './common/auth';
import CreatePost from './components/CreatePost';

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  const location = useLocation();
  let from = (location.state as any)?.from?.pathname || "/login";

  useEffect(() => {
        validateLogin().then(() => {
          auth.logInValidated(true);
        }).catch(() => {
          auth.logInValidated(false);
        }); 
  }, [location.key]);

  if (!auth.loggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return children;
}

function RequireNoAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();
  let from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
        validateLogin().then(() => {
          auth.logInValidated(true);
        }).catch(() => {
          auth.logInValidated(false);
        });
  }, [location.key]);

  if (auth.loggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<RequireAuth><Home /></RequireAuth>} />
          <Route path='/login' element={<RequireNoAuth><Login /></RequireNoAuth>} />
          <Route path='/register' element={<RequireNoAuth><Register /></RequireNoAuth>} />
          <Route path='/edit-profile' element={<RequireAuth><EditProfile /></RequireAuth>} />
          <Route path='/create-post' element={<RequireAuth><CreatePost /></RequireAuth>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

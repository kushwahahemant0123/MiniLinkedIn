import './App.css';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import VerifyEmail from './pages/verifyEmail';
import LoginPage from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/profile';
import Header from './pages/header';
import CreatePost from './components/CreatePost';
import FeedPage from './pages/feed';

function AppRoutes() {
  const location = useLocation();

  const noHeaderRoutes = ['/login', '/register', '/verify-email'];
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/post' element={<CreatePost />} />
        <Route path='/' element={<FeedPage />} />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

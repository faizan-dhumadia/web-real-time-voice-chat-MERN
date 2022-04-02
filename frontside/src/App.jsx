
import './App.css';
import Navebar from './Components/Navebar';
import Home from './Pages/Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Authenticate from './Pages/Authenticate';
import Rooms from './Pages/Rooms';
import Activates from './Pages/Activates';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './Components/Loader';
import Room from './Pages/Room';


function App() {
  const { loading } = useLoadingWithRefresh();
  // const loading = true;
  return loading ? <Loader message="Loading, please wait..." /> : (
    <BrowserRouter className="App">
      <Navebar />
      <Routes>
        <Route exact path="/" element={<GuestRoute><Home /></GuestRoute>} />
        <Route exact path="/authenticate" element={<GuestRoute> <Authenticate /></GuestRoute >} />
        <Route exact path="/activate" element={<SemiProtectedRoute><Activates /></SemiProtectedRoute>} />
        <Route exact path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route exact path="/room/:id" element={<ProtectedRoute><Room /></ProtectedRoute>} />
      </Routes>

    </BrowserRouter>
  );
}


const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return (
    isAuth ? <Navigate to="/rooms" /> : children
  );
};

const SemiProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    !isAuth ? <Navigate to="/" /> : isAuth && !user.activated ? children : <Navigate to="/rooms" />
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    !isAuth ? <Navigate to="/" /> : isAuth && !user.activated ? <Navigate to="/activate" /> : children
  );
};
export default App;

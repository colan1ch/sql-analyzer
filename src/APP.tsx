import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import IndexesPage from './pages/IndexesPage/IndexesPage';
import IndexPage from './pages/IndexPage/IndexPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import QueriesPage from './pages/QueriesPage/QueriesPage';
import QueryPage from './pages/QueryPage/QueryPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { ROUTES } from './Routes';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.INDEXES} element={<IndexesPage />} />
        <Route path={ROUTES.INDEX} element={<IndexPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.QUERIES} element={<QueriesPage />} />
        <Route path={ROUTES.QUERY} element={<QueryPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
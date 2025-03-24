import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompetitionPage from './pages/CompetitionPage';
import GlobalStyle from './styles/GlobalStyles';

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/competition" element={<CompetitionPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
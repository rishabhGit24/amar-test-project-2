import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PizzeriaPage from './pizzeria/PizzeriaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pizzeria" element={<PizzeriaPage />} />
        <Route path="/" element={<Navigate to="/pizzeria" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

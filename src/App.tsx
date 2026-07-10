import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PizzeriaPage from './pizzeria/PizzeriaPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div><h1>Amar's Pizzeria</h1></div>} />
        <Route path="/pizzeria" element={<PizzeriaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

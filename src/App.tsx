import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AssetsPage from './pages/AssetsPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className="app-header">
          <h1 className="app-title">Asset Manager</h1>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<AssetsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import AssetsPage from './pages/AssetsPage';
import AssetTypesPage from './pages/AssetTypesPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <header className="app-header">
          <h1 className="app-title">Asset Manager</h1>
          <nav className="nav">
            <NavLink className="nav-link" to="/">
              Assets
            </NavLink>
            <NavLink className="nav-link" to="/types">
              Types
            </NavLink>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<AssetsPage />} />
            <Route path="/types" element={<AssetTypesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

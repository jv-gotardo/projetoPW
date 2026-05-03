import { useState } from 'react'; // Adicionado
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import ListarCategorias from './pages/ListarCategorias';
import ListarJogadores from './pages/ListarJogadores';
import ListarPartidas from './pages/ListarPartidas';
import Home from './pages/Home';
import bannerImg from './assets/banner_site.jpg';

function App() {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <BrowserRouter>
      <Menu isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/categorias" element={<ListarCategorias isAdmin={isAdmin} />} />
          <Route path="/jogadores" element={<ListarJogadores isAdmin={isAdmin} />} />
          <Route path="/partidas" element={<ListarPartidas isAdmin={isAdmin}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
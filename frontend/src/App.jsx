import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import ListarCategorias from './pages/ListarCategorias';
import ListarJogadores from './pages/ListarJogadores';
import ListarPartidas from './pages/ListarPartidas';
import Home from './pages/Home';
import api from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  useEffect(() => {
    const perfil = localStorage.getItem('role');
    setIsAdmin(perfil === 'admin');
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin('');
    try {
      const resposta = await api.post('/auth/login', { email, senha });
      
      // Salva os dados retornados pelo seu backend do Render
      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('role', resposta.data.usuario.role);
      
      setToken(resposta.data.token);
    } catch (err) {
      setErroLogin(err.response?.data?.erro || 'Erro ao realizar login.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setIsAdmin(false);
  };

  if (!token) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
          <h3 className="text-center mb-4">Ranking Tênis - Login</h3>
          {erroLogin && <div className="alert alert-danger">{erroLogin}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input 
                type="password" 
                className="form-control" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Menu isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      <div className="container mt-4">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
            Sair do Sistema
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<ListarCategorias isAdmin={isAdmin} />} />
          <Route path="/jogadores" element={<ListarJogadores isAdmin={isAdmin} />} />
          <Route path="/partidas" element={<ListarPartidas isAdmin={isAdmin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
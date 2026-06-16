import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import ListarCategorias from './pages/ListarCategorias';
import ListarJogadores from './pages/ListarJogadores';
import ListarPartidas from './pages/ListarPartidas';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import api from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');
  
  // Estados para o formulário de Login e Cadastro
  const [cadastrando, setCadastrando] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  // Sincroniza o perfil de admin sempre que o token mudar
  useEffect(() => {
    const perfil = localStorage.getItem('role');
    setIsAdmin(perfil === 'admin');
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin('');
    try {
      const resposta = await api.post('/auth/login', { email, senha });
      
      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('role', resposta.data.usuario.role);
      
      setToken(resposta.data.token);
      setEmail('');
      setSenha('');
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

  // Se NÃO houver token salvo, renderiza as telas de Login/Cadastro externas
  if (!token) {
    if (cadastrando) {
      const handleCadastro = async (e) => {
        e.preventDefault();
        setErroLogin('');
        try {
          await api.post('/auth/register', { nome, email, senha });
          alert('Conta criada com sucesso! Faça o seu login.');
          setCadastrando(false);
          setNome('');
          setEmail('');
          setSenha('');
        } catch (err) {
          setErroLogin(err.response?.data?.erro || 'Erro ao realizar cadastro.');
        }
      };

      return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="text-center mb-4">Torneio TM - Criar Conta</h3>
            {erroLogin && <div className="alert alert-danger">{erroLogin}</div>}
            <form onSubmit={handleCadastro}>
              <div className="mb-3">
                <label className="form-label">Nome Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                />
              </div>
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
              <button type="submit" className="btn btn-success w-100 mb-3">Cadastrar</button>
              <div className="text-center">
                <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => { setCadastrando(false); setErroLogin(''); }}>
                  Já tem uma conta? Voltar para o Login
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
          <h3 className="text-center mb-4">Torneio TM - Login</h3>
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
            <button type="submit" className="btn btn-primary w-100 mb-3">Entrar</button>
            <div className="text-center">
              <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => { setCadastrando(true); setErroLogin(''); }}>
                Não tem uma conta? Cadastre-se aqui
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Se HOUVER token, renderiza o sistema completo
  return (
    <BrowserRouter>
      <Menu isAdmin={isAdmin} handleLogout={handleLogout} />
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<ListarCategorias isAdmin={isAdmin} />} />
          <Route path="/jogadores" element={<ListarJogadores isAdmin={isAdmin} />} />
          <Route path="/partidas" element={<ListarPartidas isAdmin={isAdmin} />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
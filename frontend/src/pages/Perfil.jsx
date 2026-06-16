import { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import api from '../services/api';

function Perfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const resposta = await api.get('/usuarios/perfil');
        setNome(resposta.data.nome);
        setEmail(resposta.data.email);
        setLoading(false);
      } catch (err) {
        setMensagem({ tipo: 'danger', texto: 'Erro ao carregar dados do perfil.' });
        setLoading(false);
      }
    };
    carregarPerfil();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    try {
      const payload = { nome, email };
      if (senha) payload.senha = senha;

      await api.put('/usuarios/perfil', payload);
      setMensagem({ tipo: 'success', texto: 'Perfil atualizado com sucesso!' });
      setSenha('');
    } catch (err) {
      setMensagem({ tipo: 'danger', texto: err.response?.data?.erro || 'Erro ao atualizar perfil.' });
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: '500px' }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Meus Dados de Login</Card.Title>
          
          {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}

          <Form onSubmit={handleSalvar}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nova Senha (deixe em branco para não alterar)</Form.Label>
              <Form.Control 
                type="password" 
                value={senha} 
                placeholder="Digite a nova senha..."
                onChange={(e) => setSenha(e.target.value)} 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Salvar Alterações
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Perfil;
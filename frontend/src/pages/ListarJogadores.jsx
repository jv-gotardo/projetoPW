import { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

function ListarJogadores({ isAdmin }) {
  const [jogadores, setJogadores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Estados do Modal de Cadastro/Edição
  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // --- NOVOS ESTADOS PARA FILTRO ---
  const [showFiltro, setShowFiltro] = useState(false);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState('');

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [resJogadores, resCategorias] = await Promise.all([
        api.get('/jogadores'),
        api.get('/categorias')
      ]);

      const jogadoresOrdenados = resJogadores.data.sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );

      const categoriasOrdenadas = resCategorias.data.sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );

      setJogadores(jogadoresOrdenados);
      setCategorias(categoriasOrdenadas);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setErro("Erro ao carregar dados dos jogadores.");
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Lógica de Filtragem: Se filtroCategoriaId estiver vazio, mostra todos.
  const jogadoresExibidos = filtroCategoriaId 
    ? jogadores.filter(j => j.categoria_id === Number(filtroCategoriaId))
    : jogadores;

  const handleClose = () => {
    setShowModal(false);
    setEditandoId(null);
    setNome('');
    setCategoriaId('');
  };

  const handleShowEditar = (jogador) => {
    setEditandoId(jogador.id);
    setNome(jogador.nome);
    setCategoriaId(jogador.categoria_id || '');
    setShowModal(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    const payload = { 
      nome: nome, 
      categoria_id: Number(categoriaId) 
    };

    try {
      if (editandoId) {
        await api.put(`/jogadores/${editandoId}`, payload);
      } else {
        await api.post('/jogadores', payload);
      }
      handleClose();
      carregarDados();
    } catch (err) {
      console.error("Erro ao salvar jogador:", err.response?.data || err.message);
      alert("Erro ao salvar jogador.");
    }
  };

  const handleExcluir = async (id, nomeJogador) => {
    if (window.confirm(`Excluir o jogador "${nomeJogador}"?`)) {
      try {
        await api.delete(`/jogadores/${id}`);
        carregarDados();
      } catch (err) {
        alert("Erro ao excluir.");
      }
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (erro) return <Alert variant="danger">{erro}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Jogadores {filtroCategoriaId && <small className="text-muted">(Filtrado)</small>}</h2>
        <div>
          {/* BOTÃO DE FILTRO */}
          <Button 
            variant="outline-secondary" 
            className="me-2" 
            onClick={() => setShowFiltro(true)}
          >
            {filtroCategoriaId ? 'Filtro Ativo' : 'Filtrar'}
          </Button>

          {isAdmin && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Novo Jogador
            </Button>
          )}
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            {isAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {jogadoresExibidos.map(j => {
            const categoriaEncontrada = categorias.find(c => c.id === j.categoria_id);
            const nomeCategoria = j.categoria?.nome || categoriaEncontrada?.nome || 'Sem Categoria';

            return (
              <tr key={j.id}>
                <td>{j.nome}</td>
                <td>{nomeCategoria}</td>
                {isAdmin && (
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditar(j)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleExcluir(j.id, j.nome)}>
                      Excluir
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
          {jogadoresExibidos.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 3 : 2} className="text-center">Nenhum jogador encontrado para este critério.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* MODAL DE FILTRO */}
      <Modal show={showFiltro} onHide={() => setShowFiltro(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filtrar Jogadores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Exibir apenas categoria:</Form.Label>
            <Form.Select 
              value={filtroCategoriaId} 
              onChange={(e) => setFiltroCategoriaId(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={() => { setFiltroCategoriaId(''); setShowFiltro(false); }}>
            Limpar Filtro
          </Button>
          <Button variant="primary" onClick={() => setShowFiltro(false)}>
            Aplicar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE CADASTRO/EDIÇÃO (Mantido igual) */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editandoId ? 'Editar Jogador' : 'Novo Jogador'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSalvar}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Jogador</Form.Label>
              <Form.Control 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select 
                value={categoriaId} 
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome} ({cat.nivel})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" type="submit">
              {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ListarJogadores;
import { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

function ListarCategorias({ isAdmin }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // Define se é edição (ID) ou criação (null)
  const [novoNome, setNovoNome] = useState('');
  const [novoNivel, setNovoNivel] = useState('');

  const carregarCategorias = () => {
    setLoading(true);
    api.get('/categorias')
      .then(response => {
        const dadosOrdenados = response.data.sort((a, b) => 
          a.nome.localeCompare(b.nome)
        );
        setCategorias(dadosOrdenados);
        setLoading(false);
      })
      .catch(err => {
        setErro("Não foi possível carregar as categorias.");
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditandoId(null);
    setNovoNome('');
    setNovoNivel('');
  };

  const handleShowCriar = () => {
    setEditandoId(null);
    setShowModal(true);
  };

  const handleShowEditar = (cat) => {
    setEditandoId(cat.id);
    setNovoNome(cat.nome);
    setNovoNivel(cat.nivel);
    setShowModal(true);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // Lógica de UPDATE (PUT)
        await api.put(`/categorias/${editandoId}`, { nome: novoNome, nivel: novoNivel });
      } else {
        // Lógica de CREATE (POST)
        await api.post('/categorias', { nome: novoNome, nivel: novoNivel });
      }
      handleClose();
      carregarCategorias(); 
    } catch (err) {
      alert("Erro ao salvar categoria");
    }
  };

  const handleExcluir = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${nome}"?`)) {
      try {
        await api.delete(`/categorias/${id}`);
        carregarCategorias();
      } catch (err) {
        alert("Erro ao excluir categoria. Verifique se há jogadores nela.");
      }
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (erro) return <Alert variant="danger">{erro}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categorias</h2>
        {isAdmin && (
          <Button variant="primary" onClick={handleShowCriar}>
            Nova Categoria
          </Button>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nível</th>
            {isAdmin && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.nome}</td>
              <td>{cat.nivel}</td>
              {isAdmin && (
                <td>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleShowEditar(cat)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleExcluir(cat.id, cat.nome)}
                  >
                    Excluir
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editandoId ? 'Editar Categoria' : 'Nova Categoria'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSalvar}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Categoria</Form.Label>
              <Form.Control 
                type="text" 
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nível</Form.Label>
              <Form.Control 
                type="text" 
                value={novoNivel}
                onChange={(e) => setNovoNivel(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ListarCategorias;
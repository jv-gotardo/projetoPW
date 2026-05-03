import { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form, Card, Badge } from 'react-bootstrap';
import api from '../services/api';

function ListarPartidas({ isAdmin }) {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Cadastro/Edição
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [winnerId, setWinnerId] = useState('');
  const [loserId, setLoserId] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [location, setLocation] = useState('');

  // Estados para Filtros
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const getLevelConfig = (levelName) => {
    const name = levelName?.toLowerCase();
    switch (name) {
      case 'iniciante': return { color: '#FFA500', label: 'Iniciante' };
      case 'intermediário': case 'intermediario': return { color: '#FFFF00', label: 'Intermediário' };
      case 'avançado': case 'avancado': return { color: '#ADD8E6', label: 'Avançado' };
      case 'profissional': return { color: '#C8A2C8', label: 'Profissional' };
      default: return { color: '#FFFFFF', label: levelName || '' };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resMatches, resPlayers, resCategories] = await Promise.all([
        api.get('/partidas'),
        api.get('/jogadores'),
        api.get('/categorias')
      ]);
      setMatches(resMatches.data);
      setPlayers(resPlayers.data);
      setCategories(resCategories.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar dados.");
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setWinnerId('');
    setLoserId('');
    setMatchDate('');
    setLocation('');
  };

const handleShowEditar = (match) => {
  setEditingId(match.id);
  setWinnerId(match.vencedor_id);
  setLoserId(match.perdedor_id);
  setLocation(match.local);

  if (match.data) {
    // Garante que a data seja convertida corretamente para o input do navegador
    const d = new Date(match.data);
    const offset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - offset).toISOString().slice(0, 16);
    setMatchDate(localISOTime);
  }
  
  setShowModal(true);
};
  // BOTÃO EXCLUIR IGUAL AO JOGADORES
  const handleExcluir = async (id) => {
    if (window.confirm("Deseja realmente excluir esta partida?")) {
      try {
        await api.delete(`/partidas/${id}`);
        fetchData();
      } catch (err) { 
        alert("Erro ao excluir."); 
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const winner = players.find(p => p.id === Number(winnerId));
    const loser = players.find(p => p.id === Number(loserId));

    if (winner.categoria_id !== loser.categoria_id) {
      alert("Erro: Jogadores de categorias diferentes!");
      return;
    }

    const dataFormatada = new Date(matchDate);

    const payload = {
        vencedor_id: Number(winnerId),
        perdedor_id: Number(loserId),
        data: dataFormatada, 
        local: location
    };

    try {
        if (editingId) {
        await api.put(`/partidas/${editingId}`, payload);
        } else {
        await api.post('/partidas', payload);
        }
        handleClose();
        fetchData();
    } catch (err) {
        alert("Erro ao salvar.");
    }
    };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Partidas Realizadas</h2>
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={() => setShowFilterModal(true)}>
            {(filterCategoryId || filterLevel) ? 'Filtro Ativo' : 'Filtrar'}
          </Button>
          {isAdmin && <Button variant="primary" onClick={() => setShowModal(true)}>Nova Partida</Button>}
        </div>
      </div>

      {categories
        .filter(c => !filterCategoryId || c.id === Number(filterCategoryId))
        .filter(c => !filterLevel || c.nivel.toLowerCase() === filterLevel.toLowerCase())
        .map(category => {
          const categoryMatches = matches.filter(m => {
            const player = players.find(p => p.id === m.vencedor_id);
            return player?.categoria_id === category.id;
          });

          if (categoryMatches.length === 0) return null;
          const config = getLevelConfig(category.nivel);

          return (
            <Card key={category.id} className="mb-4 shadow-sm" style={{ borderLeft: `10px solid ${config.color}` }}>
              <Card.Header style={{ backgroundColor: config.color }}>
                <strong>{category.nome}</strong> — <Badge bg="dark">{config.label}</Badge>
              </Card.Header>
              <Card.Body>
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Local</th>
                      <th>Vencedor</th>
                      <th>Perdedor</th>
                      {isAdmin && <th>Ações</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMatches.map(m => (
                      <tr key={m.id}>
                        <td>
                        {m.data ? (
                            new Date(m.data).toLocaleString('pt-BR', {
                            timeZone: 'UTC', // Lê o valor bruto do banco
                            hour12: false
                            })
                        ) : 'Data não registrada'}
                        </td>
                        <td>{m.local}</td>
                        <td className="table-success fw-bold text-success">{players.find(p => p.id === m.vencedor_id)?.nome}</td>
                        <td className="table-danger fw-bold text-danger">{players.find(p => p.id === m.perdedor_id)?.nome}</td>
                        {isAdmin && (
                          <td>
                            <Button 
                                variant="warning" 
                                size="sm" 
                                className="me-2" 
                                onClick={() => handleShowEditar(m)}
                            >
                              Editar
                            </Button>
                            <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => handleExcluir(m.id)}
                            >
                              Excluir
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          );
        })}

      {/* Modais de Filtro e Cadastro/Edição permanecem com a lógica de salvamento corrigida */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton><Modal.Title>Filtrar Partidas</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Por Categoria</Form.Label>
            <Form.Select value={filterCategoryId} onChange={e => setFilterCategoryId(e.target.value)}>
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Por Nível</Form.Label>
            <Form.Select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
              <option value="">Todos</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediário">Intermediário</option>
              <option value="avançado">Avançado</option>
              <option value="profissional">Profissional</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={() => { setFilterCategoryId(''); setFilterLevel(''); setShowFilterModal(false); }}>Limpar Filtro</Button>
          <Button variant="primary" onClick={() => setShowFilterModal(false)}>Aplicar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton><Modal.Title>{editingId ? 'Editar Partida' : 'Registrar Partida'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control type="datetime-local" required value={matchDate} onChange={e => setMatchDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Local</Form.Label>
              <Form.Control type="text" required value={location} onChange={e => setLocation(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vencedor</Form.Label>
              <Form.Select required value={winnerId} onChange={e => setWinnerId(e.target.value)}>
                <option value="">Selecione...</option>
                {players.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Perdedor</Form.Label>
              <Form.Select required value={loserId} onChange={e => setLoserId(e.target.value)}>
                <option value="">Selecione...</option>
                {players.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary" type="submit">{editingId ? 'Salvar Alterações' : 'Gravar Resultado'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ListarPartidas;
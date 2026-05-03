import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import imgTenisMesa from '../assets/tenis_de_mesa.jpg';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${imgTenisMesa})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container>
          <h1 className="display-3 fw-bold">Ranking de Tênis de Mesa</h1>
          <p className="lead">Gerencie jogadores, registre partidas e acompanhe a evolução do ranking.</p>
          <div className="mt-4">
            <Button variant="primary" size="lg" className="me-3" onClick={() => navigate('/partidas')}>
              Ver Partidas
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => navigate('/jogadores')}>
              Ver Jogadores
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '2rem' }}>🏓</div>
                <Card.Title>Competição</Card.Title>
                <Card.Text>
                  Todas as partidas são validadas por categoria para garantir um ranking justo.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '2rem' }}>📊</div>
                <Card.Title>Estatísticas</Card.Title>
                <Card.Text>
                  Acompanhe quem são os líderes de cada categoria e nível técnico.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm p-3">
              <Card.Body>
                <div className="mb-3" style={{ fontSize: '2rem' }}>📅</div>
                <Card.Title>Histórico</Card.Title>
                <Card.Text>
                  Consulte locais e datas de todos os confrontos realizados na temporada.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
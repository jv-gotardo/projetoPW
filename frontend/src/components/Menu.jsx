import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Menu({ isAdmin, handleLogout }) { 
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Torneio TM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/categorias">Categorias</Nav.Link>
            <Nav.Link as={Link} to="/jogadores">Jogadores</Nav.Link>
            <Nav.Link as={Link} to="/partidas">Partidas</Nav.Link>
            <Nav.Link as={Link} to="/perfil">Meus Dados</Nav.Link>
          </Nav>
          
          <Nav className="align-items-center me-3">
            <span className="text-white">
              Perfil: {isAdmin ? (
                <Badge bg="danger" className="ms-2">Administrador</Badge>
              ) : (
                <Badge bg="secondary" className="ms-2">Usuário</Badge>
              )}
            </span>
          </Nav>

          <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
            Sair
          </button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
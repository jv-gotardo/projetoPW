import { Navbar, Container, Nav, Form } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';

function Menu({ isAdmin, setIsAdmin }) {
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
          </Nav>
          
          <Form.Check 
            type="switch"
            id="custom-switch"
            label={isAdmin ? "Modo ADM" : "Modo Usuário"}
            className="text-white"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
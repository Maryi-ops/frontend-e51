
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrar,
  setMostrar,
  clienteEditado = {
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    celular: "",
    direccion: "",
    cedula: "",
  },
  setClienteEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setClienteEditado?.((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar?.(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="primerNombre">
            <Form.Label>Primer nombre</Form.Label>
            <Form.Control
              type="text"
              name="primer_nombre"
              value={clienteEditado?.primer_nombre ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: Juan"
              maxLength={30}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="segundoNombre">
            <Form.Label>Segundo nombre</Form.Label>
            <Form.Control
              type="text"
              name="segundo_nombre"
              value={clienteEditado?.segundo_nombre ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: Carlos"
              maxLength={30}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="primerApellido">
            <Form.Label>Primer apellido</Form.Label>
            <Form.Control
              type="text"
              name="primer_apellido"
              value={clienteEditado?.primer_apellido ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: Gómez"
              maxLength={30}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="segundoApellido">
            <Form.Label>Segundo apellido</Form.Label>
            <Form.Control
              type="text"
              name="segundo_apellido"
              value={clienteEditado?.segundo_apellido ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: Pérez"
              maxLength={30}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="celular">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              type="text"
              name="celular"
              value={clienteEditado?.celular ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: 0991234567"
              maxLength={20}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="direccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={clienteEditado?.direccion ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: Calle 123 #45-67"
              maxLength={150}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="cedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={clienteEditado?.cedula ?? ""}
              onChange={manejarCambio}
              placeholder="Ej: 1234567890"
              maxLength={20}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar?.(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!String(clienteEditado?.primer_nombre ?? "").trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCliente;

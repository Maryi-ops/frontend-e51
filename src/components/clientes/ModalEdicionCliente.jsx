import { Modal, Form, Button } from "react-bootstrap";

import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrar,
  setMostrar,
  clienteEditado,
  setClienteEditado,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="primernombre">
            <Form.Label>Primer nombre</Form.Label>
            <Form.Control
              type="text"
              name="primernombre"
              value={clienteEditado?.primernombre}
              onChange={manejarCambio}
              placeholder="Ej: Juan"
              maxLength={20}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="segundonombre">
            <Form.Label>Segundo nombre</Form.Label>
        <Form.Control
              as="textarea"
              rows={3}
              name="segundo_nombre"
              value={clienteEditado?.segundo_nombre}
              onChange={manejarCambio}
              placeholder="Ej: Mahuricio"
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="primerapellido">
            <Form.Label>Primer apellido</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="primer_apellido"
              value={clienteEditado?.primer_apellido}
              onChange={manejarCambio}
              placeholder="Ej: Gomez"
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="segundoapellido">
            <Form.Label>Segundo apellido</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="primer_apellido"
              value={clienteEditado?.primer_apellido}
              onChange={manejarCambio}
              placeholder="Ej: Garcia"
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="celular">
            <Form.Label>Celular</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="celular"
              value={clienteEditado?.celular}
              onChange={manejarCambio}
              placeholder="Ej: ********"
              maxLength={100}
            />
          </Form.Group>

            

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={guardarEdicion}
          disabled={!categoriaEditada?.nombre_categoria.trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;

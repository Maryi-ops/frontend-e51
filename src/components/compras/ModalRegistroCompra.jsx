import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCompra = ({
  mostrarModal,
  setMostrarModal,
  nuevoCompra = { id_empleado: "", fecha_compra: "", total_compra: "" },
  manejarCambioInput,
  agregarCompra,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="idEmpleado">
            <Form.Label>ID Empleado</Form.Label>
            <Form.Control
              type="text"
              name="id_empleado"
              value={nuevoCompra.id_empleado}
              onChange={manejarCambioInput}
              placeholder="ID del empleado"
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fechaCompra">
            <Form.Label>Fecha de Compra</Form.Label>
            <Form.Control
              type="date"
              name="fecha_compra"
              value={nuevoCompra.fecha_compra}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="totalCompra">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="number"
              name="total_compra"
              value={nuevoCompra.total_compra}
              onChange={manejarCambioInput}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={agregarCompra}
          disabled={
            !String(nuevoCompra.id_empleado ?? "").trim() ||
            !String(nuevoCompra.total_compra ?? "").trim()
          }
        >
          Guardar Compra
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCompra;
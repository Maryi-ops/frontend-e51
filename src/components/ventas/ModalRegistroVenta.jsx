
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroVenta = ({
  mostrarModal,
  setMostrarModal,
  nuevoVenta = {
    id_cliente: "",
    id_empleado: "",
    fecha_venta: "",
    total_venta: "",
  },
  manejarCambioInput,
  agregarVenta,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="idCliente">
            <Form.Label>ID Cliente</Form.Label>
            <Form.Control
              type="text"
              name="id_cliente"
              value={nuevoVenta.id_cliente}
              onChange={manejarCambioInput}
              placeholder="ID del cliente"
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idEmpleado">
            <Form.Label>ID Empleado</Form.Label>
            <Form.Control
              type="text"
              name="id_empleado"
              value={nuevoVenta.id_empleado}
              onChange={manejarCambioInput}
              placeholder="ID del empleado"
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fechaVenta">
            <Form.Label>Fecha de Venta</Form.Label>
            <Form.Control
              type="date"
              name="fecha_venta"
              value={nuevoVenta.fecha_venta}
              onChange={manejarCambioInput}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="totalVenta">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="number"
              name="total_venta"
              value={nuevoVenta.total_venta}
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
          onClick={agregarVenta}
          disabled={
            !String(nuevoVenta.id_cliente ?? "").trim() ||
            !String(nuevoVenta.total_venta ?? "").trim()
          }
        >
          Guardar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroVenta;

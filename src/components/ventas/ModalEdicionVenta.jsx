
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionVenta = ({
  mostrar,
  setMostrar,
  ventaEditada = { id_cliente: "", id_empleado: "", fecha_venta: "", total_venta: "" },
  setVentaEditada,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setVentaEditada?.((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar?.(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Venta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="idCliente">
            <Form.Label>ID Cliente</Form.Label>
            <Form.Control
              type="text"
              name="id_cliente"
              value={ventaEditada?.id_cliente ?? ""}
              onChange={manejarCambio}
              placeholder="ID del cliente"
              maxLength={50}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="idEmpleado">
            <Form.Label>ID Empleado</Form.Label>
            <Form.Control
              type="text"
              name="id_empleado"
              value={ventaEditada?.id_empleado ?? ""}
              onChange={manejarCambio}
              placeholder="ID del empleado"
              maxLength={50}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fechaVenta">
            <Form.Label>Fecha de Venta</Form.Label>
            <Form.Control
              type="date"
              name="fecha_venta"
              value={ventaEditada?.fecha_venta ?? ""}
              onChange={manejarCambio}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="totalVenta">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="number"
              name="total_venta"
              value={ventaEditada?.total_venta ?? ""}
              onChange={manejarCambio}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
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
          disabled={
            !String(ventaEditada?.id_cliente ?? "").trim() ||
            !String(ventaEditada?.total_venta ?? "").trim()
          }
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionVenta;

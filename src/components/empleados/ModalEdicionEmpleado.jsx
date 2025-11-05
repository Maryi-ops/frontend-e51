import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCompra = ({
  mostrar,
  setMostrar,
  compraEditada = { id_empleado: "", fecha_compra: "", total_compra: "" },
  setCompraEditada,
  guardarEdicion,
}) => {
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setCompraEditada?.((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal backdrop="static" show={mostrar} onHide={() => setMostrar?.(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="idEmpleado">
            <Form.Label>ID Empleado</Form.Label>
            <Form.Control
              type="text"
              name="id_empleado"
              value={compraEditada?.id_empleado ?? ""}
              onChange={manejarCambio}
              placeholder="ID del empleado"
              maxLength={50}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fechaCompra">
            <Form.Label>Fecha de Compra</Form.Label>
            <Form.Control
              type="date"
              name="fecha_compra"
              value={compraEditada?.fecha_compra ?? ""}
              onChange={manejarCambio}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="totalCompra">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="number"
              name="total_compra"
              value={compraEditada?.total_compra ?? ""}
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
          disabled={!String(compraEditada?.id_empleado ?? "").trim() || !String(compraEditada?.total_compra ?? "").trim()}
        >
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCompra;
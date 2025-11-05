import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrar,
  setMostrar,
  cliente,
  confirmarEliminacion,
}) => {
  const nombreCompleto = `${cliente?.primer_nombre ?? ""} ${cliente?.segundo_nombre ?? ""} ${cliente?.primer_apellido ?? ""} ${cliente?.segundo_apellido ?? ""}`.replace(/\s+/g, ' ').trim();

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Estás seguro de que deseas eliminar el cliente{' '}
          <strong>"{nombreCompleto || cliente?.cedula || 'cliente'}"</strong>?
        </p>
        {cliente?.cedula && (
          <p className="text-muted small">Cédula: {cliente.cedula}</p>
        )}
        <p className="text-muted small">Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={confirmarEliminacion}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;

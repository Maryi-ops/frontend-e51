import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
    mostrar,
    setMostrar,
    productoEditado,
    setProductoEditado,
    guardarEdicion,
}) => {
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setProductoEditado((prev) => ({ ...prev, [name]: value }));
    };

    const manejarImagen = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductoEditado((prev) => ({
                    ...prev,
                    imagen: reader.result, // Guardamos Base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal backdrop="static" show={mostrar} onHide={() => setMostrar(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="nombre_producto">
                        <Form.Label>Nombre del Producto</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre_producto"
                            value={productoEditado?.nombre_producto || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: Pintura Blanca"
                            maxLength={20}
                            required
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="descripcion_producto">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion_producto"
                            value={productoEditado?.descripcion_producto || ""}
                            onChange={manejarCambio}
                            placeholder="Descripción del producto"
                            maxLength={100}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="precio_unitario">
                        <Form.Label>Precio Unitario</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="precio_unitario"
                            value={productoEditado?.precio_unitario || ""}
                            onChange={manejarCambio}
                            placeholder="Ej: 25.50"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="stock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="text"
                            name="stock"
                            value={productoEditado?.stock}
                            onChange={manejarCambio}
                            placeholder="Ej: 10"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="imagen">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={manejarImagen} />
                    </Form.Group>

                    {productoEditado?.imagen && (
                        <div className="text-center mb-3">
                            <img
                                src={productoEditado.imagen}
                                alt="Vista previa"
                                style={{ width: "150px", borderRadius: "5px" }}
                            />
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setMostrar(false)}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={guardarEdicion}
                    disabled={!productoEditado?.nombre_producto?.trim()}
                >
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionProducto;
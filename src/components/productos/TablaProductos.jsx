import { Spinner, Table } from "react-bootstrap";

const TablaProductos = ({ productos, cargando }) => {

    if (cargando) {
        return (
            <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden"> Cargando... </span>
                </Spinner>

            </>
        )
    }
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>nombre_producto </th>
                    <th>descripcion_producto</th>
                    <th>id_categoria</th>
                    <th>precio_unitario</th>
                    <th>stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {productos.map((producto) => {
                    return (
                        <tr key={productos.id_producto}>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.descripcion_producto}</td>
                            <td>{producto.id_categoria}</td>
                            <td>{producto.precio_unitario}</td>
                            <td>{producto.stock}</td>
                            <td>Accion</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TablaProductos;
import { Spinner, Table } from "react-bootstrap";

const TablaVentas = ({ ventas, cargando }) => {

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
                    <th>id_cliente</th>
                    <th>id_empleado</th>
                    <th>fecha_venta</th>
                    <th>total_venta</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {ventas.map((venta) => {
                    return (
                        <tr key={venta.id_venta}>
                            <td>{venta.id_venta}</td>
                            <td>{venta.id_cliente}</td>
                            <td>{venta.id_empleado}</td>
                            <td>{venta.fecha_venta}</td>
                            <td>{venta.total_venta}</td>
                            <td>Accion</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TablaVentas;
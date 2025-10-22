import { Spinner, Table } from "react-bootstrap";

const TablaEmpleados = ({ empleados, cargando }) => {

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
                    <th>primer_nombre</th>
                    <th>segundo_nombre</th>
                    <th>primer_apellido</th>
                    <th>segundo_apellido</th>
                    <th>celular</th>
                    <th>cargo</th>
                    <th>fecha_contratacion</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {empleados.map((empleado) => {
                    return (
                        <tr key={empleado.id_empleado}>
                            <td>{empleado.id_empleado}</td>
                            <td>{empleado.primer_nombre}</td>
                            <td>{empleado.segundo_nombre}</td>
                            <td>{empleado.primer_apellido}</td>
                            <td>{empleado.segundo_apellido}</td>
                            <td>{empleado.celular}</td>
                            <td>{empleado.cargo}</td>
                            <td>{empleado.fecha_contratacion}</td>
                            <td>Accion</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TablaEmpleados;
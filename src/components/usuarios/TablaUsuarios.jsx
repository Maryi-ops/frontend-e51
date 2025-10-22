import { Spinner, Table } from "react-bootstrap";

const TablaUsuarios = ({ usuarios, cargando }) => {

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
                    <th>usuario</th>
                    <th>contraseña</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((usuario) => {
                    return (
                        <tr key={usuario.id_usuario}>
                            <td>{usuario.id_usuario}</td>
                            <td>{usuario.usuario}</td>
                            <td>{usuario.contraseña}</td>
                            <td>Accion</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TablaUsuarios;
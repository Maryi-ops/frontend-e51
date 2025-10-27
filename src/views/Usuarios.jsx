import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [usuariosFiltradas, setUsuariosFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const obtenerUsuarios = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/api/usuarios");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los Usuarios");
            }

            const datos = await respuesta.json();

            setUsuarios(datos);
            setUsuariosFiltradas(datos);
            setCargando(false);

        } catch (error) {
            console.log(error.message);
            setCargando(false);
        }
    };


    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = usuarios.filter(
            (usuario) =>
                usuario.usuario.toLowerCase().includes(texto) ||
                usuario.contraseña.toLowerCase().includes(texto)
        );
        setUsuariosFiltradas(filtradas);
    };


    useEffect(() => {
        obtenerUsuarios();
    }, []);

    return (
        <>
            <Container className="mt-4">

                <h4>Usuarios</h4>

                <Row>
                    <Col lg={5} md={8} sm={8} xs={7}>
                        <CuadroBusquedas
                            textoBusqueda={textoBusqueda}
                            manejarCambioBusqueda={manejarCambioBusqueda}
                        />
                    </Col>
                </Row>

                <TablaUsuarios
                    usuarios={usuariosFiltradas}
                    cargando={cargando}
                />

            </Container>
        </>
    );
}

export default Usuarios;
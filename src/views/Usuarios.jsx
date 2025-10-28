import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaUsuarios from "../components/usuarios/TablaUsuarios";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroUsuario from "../components/usuarios/ModalRegistroUsuario";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [usuariosFiltradas, setUsuariosFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        usuario: '',
        contraseña: ''
    });

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario(prev => ({ ...prev, [name]: value }));
    };


    const agregarUsuario = async () => {
        if (!nuevoUsuario.usuario.trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarusuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });

            if (!respuesta.ok) throw new Error('Error al guardar');

            // Limpiar y cerrar
            setNuevoUsuario({ usuario: '', contraseña: '' });
            setMostrarModal(false);
            await obtenerUsuarios(); // Refresca la lista
        } catch (error) {
            console.error("Error al agregar usuario:", error);
            alert("No se pudo guardar el usuario. Revisa la consola.");
        }
    };

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
                    <Col className="text-end">
                        <Button
                            variant="primary"
                            className="color_boton_registrar"
                            onClick={() => setMostrarModal(true)}
                        >
                            + Nueva Usuario
                        </Button>
                    </Col>
                </Row>


                <TablaUsuarios
                    usuarios={usuariosFiltradas}
                    cargando={cargando}
                />

                <ModalRegistroUsuario

                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}
                    nuevoUsuario={nuevoUsuario}
                    manejarCambioInput={manejarCambioInput}
                    agregarUsuario={agregarUsuario}
                />

            </Container>
        </>
    );
}

export default Usuarios;

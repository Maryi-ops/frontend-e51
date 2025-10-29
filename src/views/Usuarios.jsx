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
        if (!String(nuevoUsuario.usuario ?? "").trim()) return;

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
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/usuarios");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los Usuarios");
            }

            const datos = await respuesta.json();

            setUsuarios(datos || []);
            setUsuariosFiltradas(datos || []);
        } catch (error) {
            console.log(error.message);
            setUsuarios([]);
            setUsuariosFiltradas([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (usuarios || []).filter((usuario) => {
            const u = String(usuario?.usuario ?? "").toLowerCase();
            const p = String(usuario?.contraseña ?? "").toLowerCase();
            return u.includes(texto) || p.includes(texto);
        });
        setUsuariosFiltradas(filtradas);
    };

    useEffect(() => {
        obtenerUsuarios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            onClick={() => {
                                setNuevoUsuario({ usuario: '', contraseña: '' });
                                setMostrarModal(true);
                            }}
                        >
                            + Nuevo Usuario
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
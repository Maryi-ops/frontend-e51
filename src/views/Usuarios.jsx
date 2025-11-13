import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaUsuarios from '../components/usuarios/TablaUsuarios';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroUsuario from '../components/usuarios/ModalRegistroUsuario';
import ModalEdicionUsuario from '../components/usuarios/ModalEdicionUsuario';
import ModalEliminacionUsuario from '../components/usuarios/ModalEliminacionUsuario';

const Usuarios = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [usuarioEditado, setUsuarioEditado] = useState(null);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5;


    const [nuevoUsuario, setNuevoUsuario] = useState({
        usuario: '',
        contraseña: ''
    });

    const usuariosPaginados = usuariosFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario(prev => ({ ...prev, [name]: value }));
    };

    const agregarUsuario = async () => {
    if (!nuevoUsuario.usuario.trim() || !nuevoUsuario.contraseña.trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarusuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });
            if (!respuesta.ok) throw new Error('Error al guardar');
            setNuevoUsuario({
                usuario: '',
                contraseña: ''
            });
            setMostrarModal(false);
            await obtenerUsuarios();
        } catch (error) {
            console.error("Error al agregar usuario:", error);
            alert("No se pudo guardar el usuario. Revisa la consola.");
        }
    };


    const obtenerUsuarios = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/usuarios');
            if (!respuesta.ok) throw new Error('Error al obtener usuarios');
            const datos = await respuesta.json();
            setUsuarios(datos);
            setUsuariosFiltrados(datos);
            setCargando(false);

        } catch (error) {
            console.error(error.message);
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtrados = usuarios.filter(u =>
            `${u.usuario} ${u.contraseña}`.toLowerCase().includes(texto) 
        );
        setUsuariosFiltrados(filtrados);
    };

    const abrirModalEdicion = (usuario) => {
        setUsuarioEditado({ ...usuario });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!usuarioEditado.usuario.trim() || !usuarioEditado.contraseña.trim()) return;
        try {
            const respuesta = await fetch(`http://localhost:3000/api/actualizarusuarios/${usuarioEditado.id_usuario}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioEditado)
            });
            if (!respuesta.ok) throw new Error('Error al actualizar');
            setMostrarModalEdicion(false);
            await obtenerUsuarios();
        } catch (error) {
            console.error("Error al editar usuario:", error);
            alert("No se pudo actualizar el usuario.");
        }
    };

    const abrirModalEliminacion = (usuario) => {
        setUsuarioAEliminar(usuario);
        setMostrarModalEliminar(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/eliminarusuarios/${usuarioAEliminar.id_usuario}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error('Error al eliminar');
            setMostrarModalEliminar(false);
            setUsuarioAEliminar(null);
            await obtenerUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            alert("No se pudo eliminar el usuario. Puede estar en uso.");
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    return (
        <Container className="mt-4">
            <h4>Usuarios</h4>
            <Row>
                <Col lg={5} md={6} sm={8} xs={12}>
                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={manejarCambioBusqueda}
                    />
                </Col>
                <Col className="text-end">
                    <Button
                        className='color-boton-registro'
                        onClick={() => setMostrarModal(true)}
                    >
                        + Nuevo Usuario
                    </Button>
                </Col>
            </Row>

            <TablaUsuarios
                usuarios={usuariosPaginados}
                cargando={cargando}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                totalElementos={usuarios.length}
                elementosPorPagina={elementosPorPagina}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
            />

            <ModalRegistroUsuario
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoUsuario={nuevoUsuario}
                manejarCambioInput={manejarCambioInput}
                agregarUsuario={agregarUsuario}
            />

            <ModalEdicionUsuario
                mostrar={mostrarModalEdicion}
                setMostrar={setMostrarModalEdicion}
                usuarioEditado={usuarioEditado}
                setUsuarioEditado={setUsuarioEditado}
                guardarEdicion={guardarEdicion}
            />

            <ModalEliminacionUsuario
                mostrar={mostrarModalEliminar}
                setMostrar={setMostrarModalEliminar}
                usuario={usuarioAEliminar}
                confirmarEliminacion={confirmarEliminacion}
            />
        </Container>
    );
};

export default Usuarios;
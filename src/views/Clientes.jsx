// ...existing code...
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaClientes from "../components/clientes/TablaClientes";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente.jsx";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";


const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

    const [clienteEditado, setClienteEditado] = useState(null);
    const [clienteAEliminar, setClienteAEliminar] = useState(null);

    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5; // Número de productos por página

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaCliente, setNuevaCliente] = useState({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        celular: '',
        direccion: '',
        cedula: ''
    });

    // Calcular productos paginados
    const clientesPaginadas = clientesFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );


    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaCliente(prev => ({ ...prev, [name]: value }));
    };

    const abrirModalEdicion = (cliente) => {
        setClienteEditado({ ...cliente });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!String(clienteEditado?.primer_nombre ?? "").trim()) return;
        try {
            const respuesta = await fetch(`http://localhost:3000/api/actualizarclientes/${clienteEditado.id_cliente}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteEditado)
            });
            if (!respuesta.ok) throw new Error('Error al actualizar');
            setMostrarModalEdicion(false);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al editar cliente:", error);
            alert("No se pudo actualizar el cliente.");
        }
    };

    const abrirModalEliminacion = (cliente) => {
        setClienteAEliminar(cliente);
        setMostrarModalEliminar(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/eliminarclientes/${clienteAEliminar.id_cliente}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error('Error al eliminar');
            setMostrarModalEliminar(false);
            setClienteAEliminar(null);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            alert("No se pudo eliminar el cliente.");
        }
    };


    const agregarCliente = async () => {
        if (!String(nuevaCliente.primer_nombre ?? "").trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarclientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCliente)
            });

            if (!respuesta.ok) throw new Error('Error al guardar');

            // Limpiar y cerrar
            setNuevaCliente({
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                celular: '',
                direccion: '',
                cedula: ''
            });
            setMostrarModal(false);
            await obtenerClientes(); // Refresca la lista
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            alert("No se pudo guardar el cliente. Revisa la consola.");
        }
    };

    const obtenerClientes = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/clientes");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los Clientes");
            }

            const datos = await respuesta.json();

            setClientes(datos || []);
            setClientesFiltrados(datos || []);
        } catch (error) {
            console.log(error.message);
            setClientes([]);
            setClientesFiltrados([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (clientes || []).filter((cliente) => {
            const primer = String(cliente?.primer_nombre ?? "").toLowerCase();
            const segundo = String(cliente?.segundo_nombre ?? "").toLowerCase();
            const pApellido = String(cliente?.primer_apellido ?? "").toLowerCase();
            const sApellido = String(cliente?.segundo_apellido ?? "").toLowerCase();
            const celular = String(cliente?.celular ?? "").toLowerCase();
            const direccion = String(cliente?.direccion ?? "").toLowerCase();
            const cedula = String(cliente?.cedula ?? "").toLowerCase();

            return (
                primer.includes(texto) ||
                segundo.includes(texto) ||
                pApellido.includes(texto) ||
                sApellido.includes(texto) ||
                celular.includes(texto) ||
                direccion.includes(texto) ||
                cedula.includes(texto)
            );
        });
        setClientesFiltrados(filtradas);
    };


    useEffect(() => {
        obtenerClientes();
    }, []);

    return (
        <>
            <Container className="mt-4">

                <h4>Clientes</h4>

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
                                setNuevaCliente({
                                    primer_nombre: '',
                                    segundo_nombre: '',
                                    primer_apellido: '',
                                    segundo_apellido: '',
                                    celular: '',
                                    direccion: '',
                                    cedula: ''
                                });
                                setMostrarModal(true);
                            }}
                        >
                            + Nueva Cliente
                        </Button>
                    </Col>
                </Row>


                <TablaClientes
                    clientes={clientesPaginadas}
                    cargando={cargando}
                    abrirModalEdicion={abrirModalEdicion}
                    abrirModalEliminacion={abrirModalEliminacion}
                    totalElementos={clientes.length} // Total de categorias
                    elementosPorPagina={elementosPorPagina} // Elementos por página
                    paginaActual={paginaActual} // Página actual
                    establecerPaginaActual={establecerPaginaActual} // Método para cambiar página
                />

                <ModalRegistroCliente
                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}
                    nuevoCliente={nuevaCliente}
                    manejarCambioInput={manejarCambioInput}
                    agregarCliente={agregarCliente}
                />
                <ModalEdicionCliente
                    mostrar={mostrarModalEdicion}
                    setMostrar={setMostrarModalEdicion}
                    clienteEditado={clienteEditado}
                    setClienteEditado={setClienteEditado}
                    guardarEdicion={guardarEdicion}
                />

                <ModalEliminacionCliente
                    mostrar={mostrarModalEliminar}
                    setMostrar={setMostrarModalEliminar}
                    cliente={clienteAEliminar}
                    confirmarEliminacion={confirmarEliminacion}
                />

            </Container>
        </>
    );
}

export default Clientes;
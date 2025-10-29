// ...existing code...
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaClientes from "../components/clientes/TablaClientes";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente.jsx";

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

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

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaCliente(prev => ({ ...prev, [name]: value }));
    };


    const agregarCliente = async () => {
        if (!String(nuevaCliente.primer_nombre ?? "").trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarcliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCliente)
            });

            if (!respuesta.ok) throw new Error('Error al guardar');

            // Limpiar y cerrar
            setNuevaCliente({
                primer_nombre:'', 
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
                    clientes={clientesFiltrados}
                    cargando={cargando}
                />

                <ModalRegistroCliente
                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}
                    nuevoCliente={nuevaCliente}
                    manejarCambioInput={manejarCambioInput}
                    agregarCliente={agregarCliente}
                />

            </Container>
        </>
    );
}

export default Clientes;
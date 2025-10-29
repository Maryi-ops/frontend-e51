import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado.jsx";

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: "",
        segundo_apellido: "",
        celular: "",
        cargo: "",
        fecha_contratacion: ""
    });

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoEmpleado(prev => ({ ...prev, [name]: value }));
    };


    const agregarEmpleado = async () => {
        if (!String(nuevoEmpleado.primer_nombre ?? "").trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarempleado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEmpleado)
            });

            if (!respuesta.ok) throw new Error('Error al guardar');

            // Limpiar y cerrar
            setNuevoEmpleado({
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                celular: '',
                cargo: '',
                fecha_contratacion: ''
            });

            setMostrarModal(false);
            await obtenerEmpleados(); // Refresca la lista
        } catch (error) {
            console.error("Error al agregar Empleado:", error);
            alert("No se pudo guardar el empleado. Revisa la consola.");
        }
    };


    const obtenerEmpleados = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/empleados");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los Empleados");
            }

            const datos = await respuesta.json();

            setEmpleados(datos || []);
            setEmpleadosFiltrados(datos || []);
        } catch (error) {
            console.log(error.message);
            setEmpleados([]);
            setEmpleadosFiltrados([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (empleados || []).filter((empleado) => {
            const primer = String(empleado?.primer_nombre ?? "").toLowerCase();
            const segundo = String(empleado?.segundo_nombre ?? "").toLowerCase();
            const pApellido = String(empleado?.primer_apellido ?? "").toLowerCase();
            const sApellido = String(empleado?.segundo_apellido ?? "").toLowerCase();
            const celular = String(empleado?.celular ?? "").toLowerCase();
            const cargo = String(empleado?.cargo ?? "").toLowerCase();
            const fecha = String(empleado?.fecha_contratacion ?? "").toLowerCase();

            return (
                primer.includes(texto) ||
                segundo.includes(texto) ||
                pApellido.includes(texto) ||
                sApellido.includes(texto) ||
                celular.includes(texto) ||
                cargo.includes(texto) ||
                fecha.includes(texto)
            );
        });
        setEmpleadosFiltrados(filtradas);
    };

    useEffect(() => {
        obtenerEmpleados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Container className="mt-4">

                <h4>Empleados</h4>

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
                                setNuevoEmpleado({
                                    primer_nombre: '',
                                    segundo_nombre: '',
                                    primer_apellido: '',
                                    segundo_apellido: '',
                                    celular: '',
                                    cargo: '',
                                    fecha_contratacion: ''
                                });
                                setMostrarModal(true);
                            }}
                        >
                            + Nuevo Empleado
                        </Button>
                    </Col>

                </Row>


                <TablaEmpleados
                    empleados={empleadosFiltrados}
                    cargando={cargando}
                />

                <ModalRegistroEmpleado
                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}
                    nuevoEmpleado={nuevoEmpleado}
                    manejarCambioInput={manejarCambioInput}
                    agregarEmpleado={agregarEmpleado}
                />

            </Container>
        </>
    );
}

export default Empleados;
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaEmpleados from "../components/empleados/TablaEmpleados";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroEmpleado from "../components/empleados/ModalRegistroEmpleado";

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaEmpleado, setNuevaEmpleado] = useState({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: "",
        segundo_apellido: "",
        celular: "",
        direccion: "",
        cedula: ""
    });

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaEmpleado(prev => ({ ...prev, [name]: value }));
    };


    const agregarEmpleado = async () => {
        if (!nuevaEmpleado.primer_nombre.trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarempleado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaEmpleado)
            });

            if (!respuesta.ok) throw new Error('Error al guardar');

            // Limpiar y cerrar
            setNuevaEmpleado({
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
        try {
            const respuesta = await fetch("http://localhost:3000/api/empleados");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los Empleados");
            }

            const datos = await respuesta.json();

            setEmpleados(datos);
            setEmpleadosFiltrados(datos);
            setCargando(false);

        } catch (error) {
            console.log(error.message);
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = empleados.filter(
            (empleado) =>
                empleado.primer_nombre.toLowerCase().includes(texto) ||
                empleado.segundo_nombre.toLowerCase().includes(texto) ||
                empleado.primer_apellido.toLowerCase().includes(texto) ||
                empleado.segundo_apellido.toLowerCase().includes(texto) ||
                empleado.cedula.toLowerCase().includes(texto) ||
                empleado.cargo.toLowerCase().includes(texto) ||
                empleado.fecha_contratacion.toLowerCase().includes(texto)
        );
        setEmpleadosFiltrados(filtradas);
    };

    useEffect(() => {
        obtenerEmpleados();
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
                            onClick={() => setMostrarModal(true)}
                        >
                            + Nueva Empleado
                        </Button>
                    </Col>

                </Row>


                <TablaEmpleados
                    empleados={empleadosFiltrados}
                    cargando={cargando}
                />

                <ModalRegistroCategoria
                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}
                    nuevaEmpleado={nuevaEmpleado}
                    manejarCambioInput={manejarCambioInput}
                    agregarEmpleado={agregarEmpleado}
                />

            </Container>
        </>
    );
}

export default Empleados;
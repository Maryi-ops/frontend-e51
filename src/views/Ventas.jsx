import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TablaVentas from "../components/ventas/TablaVentas";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const obtenerVentas = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/ventas");
            if (!respuesta.ok) {
                throw new Error("Error al obtener las ventas");
            }

            const datos = await respuesta.json();

            setVentas(datos || []);
            setVentasFiltradas(datos || []);
        } catch (error) {
            console.log(error.message);
            setVentas([]);
            setVentasFiltradas([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (ventas || []).filter((venta) => {
            const idVenta = String(venta?.id_venta ?? "").toLowerCase();
            const idCliente = String(venta?.id_cliente ?? "").toLowerCase();
            const idEmpleado = String(venta?.id_empleado ?? "").toLowerCase();
            const fecha = String(venta?.fecha_venta ?? "").toLowerCase();
            const total = String(venta?.total_venta ?? "").toLowerCase();
            return (
                idVenta.includes(texto) ||
                idCliente.includes(texto) ||
                idEmpleado.includes(texto) ||
                fecha.includes(texto) ||
                total.includes(texto)
            );
        });
        setVentasFiltradas(filtradas);
    };

    useEffect(() => {
        obtenerVentas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Container className="mt-4">
                <h4>Ventas</h4>

                <Row>
                    <Col lg={5} md={8} sm={8} xs={7}>
                        <CuadroBusquedas
                            textoBusqueda={textoBusqueda}
                            manejarCambioBusqueda={manejarCambioBusqueda}
                        />
                    </Col>
                </Row>

                <TablaVentas
                    ventas={ventasFiltradas}
                    cargando={cargando}
                />
            </Container>
        </>
    );
};

export default Ventas;

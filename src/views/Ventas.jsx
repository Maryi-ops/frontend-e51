import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaVentas from "../components/ventas/TablaVentas";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");


    const obtenerVentas = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/api/ventas");
            if (!respuesta.ok) {
                throw new Error("Error al obtener las ventas");
            }

            const datos = await respuesta.json();

            setVentas(datos);
            setVentasFiltradas(datos);
            setCargando(false);

        } catch (error) {
            console.log(error.message);
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = ventas.filter(
            (venta) =>
                venta.id_venta.toLowerCase().includes(texto) ||
                venta.id_cliente.toLowerCase().includes(texto) ||
                venta.id_empleado.toLowerCase().includes(texto) ||
                venta.fecha_venta.toLowerCase().includes(texto) ||
                venta.total_venta.toLowerCase().includes(texto)
        );
        setVentasFiltradas(filtradas);
    };


    useEffect(() => {
        obtenerVentas();
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


                <TablaCategorias
                    ventas={ventasFiltradas}
                    cargando={cargando}
                />

            </Container>
        </>
    );
}

export default Ventas;

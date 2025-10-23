import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCompras from "../components/compras/TablaCompras";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";


const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [comprasFiltradas, setComprasFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");



    const obtenerCompras = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/api/compras");
            if (!respuesta.ok) {
                throw new Error("Error al obtener las Compras");
            }

            const datos = await respuesta.json();

            setCompras(datos);
            setComprasFiltradas(datos);
            setCargando(false);

        } catch (error) {
            console.log(error.message);
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = compras.filter(
            (compra) =>
                compra.fecha_compra.toLowerCase().includes(texto) ||
                compra.total_compra.toLowerCase().includes(texto)
        );
        setComprasFiltradas(filtradas);
    };


    useEffect(() => {
        obtenerCompras();
    }, []);

    return (
        <>
            <Container className="mt-4">

                <h4>Compras</h4>

                <Row>
                    <Col lg={5} md={8} sm={8} xs={7}>
                        <CuadroBusquedas
                            textoBusqueda={textoBusqueda}
                            manejarCambioBusqueda={manejarCambioBusqueda}
                        />
                    </Col>
                </Row>

                <TablaCompras
                    compras={comprasFiltradas}
                    cargando={cargando}
                />

            </Container>
        </>
    );
}

export default Compras;
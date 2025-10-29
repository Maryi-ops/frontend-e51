import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TablaCompras from "../components/compras/TablaCompras";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [comprasFiltradas, setComprasFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const obtenerCompras = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/compras");
            if (!respuesta.ok) {
                throw new Error("Error al obtener las Compras");
            }

            const datos = await respuesta.json();

            setCompras(datos || []);
            setComprasFiltradas(datos || []);
        } catch (error) {
            console.log(error.message);
            setCompras([]);
            setComprasFiltradas([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (compras || []).filter((compra) => {
            const fecha = String(compra?.fecha_compra ?? "").toLowerCase();
            const total = String(compra?.total_compra ?? "").toLowerCase();
            return fecha.includes(texto) || total.includes(texto);
        });
        setComprasFiltradas(filtradas);
    };

    useEffect(() => {
        obtenerCompras();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                <TablaCompras compras={comprasFiltradas} cargando={cargando} />
            </Container>
        </>
    );
};

export default Compras;
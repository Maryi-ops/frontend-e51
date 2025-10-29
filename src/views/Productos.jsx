import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaProductos from "../components/productos/TablaProductos";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [productosFiltradas, setProductosFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre_producto: "",
        descripcion_producto: "",
        id_categoria: "",
        precio_unitario: "",
        stock: "",
    });

    const obtenerProductos = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/productos");
            if (!respuesta.ok) throw new Error("Error al obtener los Productos");
            const datos = await respuesta.json();
            setProductos(datos || []);
            setProductosFiltradas(datos || []);
        } catch (error) {
            console.log(error.message);
            setProductos([]);
            setProductosFiltradas([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoProducto(prev => ({ ...prev, [name]: value }));
    };

    const agregarProducto = async () => {
        if (!String(nuevoProducto.nombre_producto ?? "").trim()) return;

        try {
            const respuesta = await fetch("http://localhost:3000/api/registrarproducto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto),
            });
            if (!respuesta.ok) throw new Error("Error al guardar");
            setNuevoProducto({
                nombre_producto: "",
                descripcion_producto: "",
                id_categoria: "",
                precio_unitario: "",
                stock: "",
            });
            setMostrarModal(false);
            await obtenerProductos();
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("No se pudo guardar el producto. Revisa la consola.");
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (productos || []).filter((p) => {
            const nombre = String(p?.nombre_producto ?? "").toLowerCase();
            const descripcion = String(p?.descripcion_producto ?? "").toLowerCase();
            const categoria = String(p?.id_categoria ?? "").toLowerCase();
            const precio = String(p?.precio_unitario ?? "").toLowerCase();
            const stock = String(p?.stock ?? "").toLowerCase();
            return (
                nombre.includes(texto) ||
                descripcion.includes(texto) ||
                categoria.includes(texto) ||
                precio.includes(texto) ||
                stock.includes(texto)
            );
        });
        setProductosFiltradas(filtradas);
    };

    useEffect(() => {
        obtenerProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Container className="mt-4">
                <h4>Productos</h4>

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
                                setNuevoProducto({
                                    nombre_producto: "",
                                    descripcion_producto: "",
                                    id_categoria: "",
                                    precio_unitario: "",
                                    stock: "",
                                });
                                setMostrarModal(true);
                            }}
                        >
                            + Nuevo Producto
                        </Button>
                    </Col>
                </Row>

                <TablaProductos productos={productosFiltradas} cargando={cargando} />

                <ModalRegistroProducto
                    mostrarModal={mostrarModal}
                    setMostrarModal={setMostrarModal}
                    nuevoProducto={nuevoProducto}
                    manejarCambioInput={manejarCambioInput}
                    agregarProducto={agregarProducto}
                />
            </Container>
        </>
    );
};

export default Productos;
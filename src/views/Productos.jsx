import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaProductos from "../components/productos/TablaProductos";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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

///////////////////////////////////////////////NUEVO CREATE PDF///////////////////////////////////////////////////////
    const generarPDFProductos = () => {
        const doc = new jsPDF();

        //Encabezado del PDF
        doc.setFillColor(28, 41, 51);
        doc.rect(0, 0, 220, 30, 'F');

        //Titulo centrado con texto blanco
        doc.setTextColor(255, 255, 255); //Color del titulo
        doc.setFontSize(28);
        doc.text("Lista de productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

        const columnas = ["ID", "Nombre", "Descripción", "Categoria", "Precio", "Stock"];
        const filas = productosFiltradas.map((productos) => [
            productos.id_producto,
            productos.nombre_producto,
            productos.descripcion_producto,
            productos.id_categoria,
            "C$" + productos.precio_unitario,
            productos.stock,
        ]);

        const totalPaginas = "{total_pages_count_string}";

        //Configuración de la tabla
        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { top: 20, left: 14, right: 14 },
            tableWidth: "auto",
            columnStyles: {
                0: { cellWidth: "auto" },
                1: { cellWidth: "auto" },
                2: { cellWidth: "auto" },
            },
            pageBreak: "auto",
            rowPageBreak: "auto",

            didDrawPage: function (data) {
                const alturaPagina = doc.internal.pageSize.getHeight();
                const anchoPagina = doc.internal.pageSize.getWidth();

                const numeroPagina = doc.internal.getNumberOfPages();

                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
                doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
            },
        });


        if (typeof doc.putTotalPages === "function") {
            doc.putTotalPages(totalPaginas);
        }

        //Guardar el PDF con un nombre
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = fecha.getFullYear();
        const nombreArchivo = "productos_" + dia + mes + anio + ".pdf";

        //Guardar el documento PDF
        doc.save(nombreArchivo);
    }

////////////////////////////////////////////////////////////////////////////////

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
            const respuesta = await fetch("http://localhost:3000/api/productos", {
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
                imagen: ""
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
            const imagen = String(p?.imagen?? "").toLowerCase();
            return (
                nombre.includes(texto) ||
                descripcion.includes(texto) ||
                categoria.includes(texto) ||
                precio.includes(texto) ||
                stock.includes(texto) ||
                imagen.includes(texto) 
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
                                    imagen: ""
                                });
                                setMostrarModal(true);
                            }}
                        >
                            + Nuevo Producto
                        </Button>
                    </Col>

                    <Col lg={3} md={4} sm={4} xs={5}>
                        <Button
                            className="mb-3"
                            onClick={generarPDFProductos}
                            variant="secondary"
                            style={{ width: "100%" }}
                        >
                            Generar reporte PDF
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
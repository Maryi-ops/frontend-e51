
import { useState, useEffect } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaCompras from "../components/compras/TablaCompras";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCompra from "../components/compras/ModalRegistroCompra";
import ModalEdicionCompra from "../components/compras/ModalEdicionCompras";
import ModalDetallesCompra from "../components/detalles_ventas/ModalDetallesVenta";
import ModalEliminacionCompra from "../components/compras/ModalEliminacionCompra";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Zoom, Fade } from "react-awesome-reveal";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5; // Número de compras por página

    const [comprasFiltradas, setComprasFiltradas] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const comprasPaginadas = comprasFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

    const [nuevaCompra, setNuevaCompra] = useState({ id_empleado: '', fecha_compra: new Date().toISOString().split('T')[0], total_compra: 0 });
    const [compraEnEdicion, setCompraEnEdicion] = useState(null);
    const [compraAEliminar, setCompraAEliminar] = useState(null);
    const [detallesNuevos, setDetallesNuevos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    const generarPDFCompras = () => {
        const doc = new jsPDF();
        // Encabezado del PDF
        doc.setFillColor(28, 41, 51);
        doc.rect(0, 0, 220, 30, 'F');
        // Texto centrado en blanco
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.text("Lista de Compras", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
        const columnas = ["ID", "Empleado", "Fecha", "Total"];
        const filas = comprasFiltradas.map(compra => [
            compra.id_compra,
            compra.id_empleado,
            compra.fecha_compra,
            C$ `${ compra.total_compra }`,
        ]);
        const totalPaginas = "{total_pages_count_string}";
        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 40,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            margin: { top: 20, left: 14, right: 14 },
            tableWidth: 'auto',
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 'auto' },
            },
            pageBreak: 'auto',
            rowPageBreak: 'auto',
            didDrawPage: function (data) {
                const alturaPagina = doc.internal.pageSize.getHeight();
                const anchoPagina = doc.internal.pageSize.getWidth();
                const numeroPagina = doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                const piePagina = Página `${ numeroPagina } de ${ totalPaginas }`;
                doc.text(piePagina, anchoPagina / 2, alturaPagina - 10, { align: "center" });
            },
        });
        //Actulizar el total de páginas
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPaginas);
        }
        // Guardar el PDF con nombre y fecha actual
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const nombreArchivo = `compras_${ dia }${ mes }${ anio }.pdf`;

        doc.save(nombreArchivo);
    };

    const obtenerCompras = async () => {
        try {
            const respuesta = await fetch("http://localhost:3000/api/compras");
            if (!respuesta.ok) {
                throw new Error("Error al obtener los clientes");
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

    const obtenerProductos = async () => {
        try {
            const resp = await fetch('http://localhost:3000/api/productos');
            if (!resp.ok) throw new Error('Error al cargar productos');
            const datos = await resp.json();
            setProductos(datos);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerEmpleados = async () => {
        try {
            const resp = await fetch('http://localhost:3000/api/empleados');
            if (!resp.ok) throw new Error('Error al cargar empleados');
            const datos = await resp.json();
            setEmpleados(datos);
        } catch (error) {
            console.error(error);
        }
    };
    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
    };

    // Derivar las compras filtradas a partir del texto de búsqueda y las compras
    useEffect(() => {
        if (textoBusqueda.trim() === "") {
            setComprasFiltradas(compras);
            return;
        }

        const filtradas = compras.filter((compra) => {
            const t = textoBusqueda;
            return (
                String(compra.id_empleado).toLowerCase().includes(t) ||
                String(compra.id_cliente).toLowerCase().includes(t) ||
                String(compra.fecha_compra).toLowerCase().includes(t) ||
                String(compra.total_compra).toLowerCase().includes(t)
            );
        });

        setComprasFiltradas(filtradas);
    }, [textoBusqueda, compras]);
    useEffect(() => {
        obtenerCompras();
        obtenerProductos();
        obtenerEmpleados();
    }, []);

    // === REGISTRO ===
    const agregarCompra = async () => {
        if (!nuevaCompra.id_empleado || detallesNuevos.length === 0) {
            alert('Completa empleado y al menos un detalle.');
            return;
        }

        const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);

        try {
            const resp = await fetch('http://localhost:3000/api/compras', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...nuevaCompra, total_compra: total })
            });
            if (!resp.ok) throw new Error('Error al crear compra');
            const { id_compra } = await resp.json();

            for (const d of detallesNuevos) {
                await fetch('http://localhost:3000/api/detalles_compras', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...d, id_compra })
                });
            }

            await obtenerCompras();
            setMostrarModalRegistro(false);
            setNuevaCompra({ id_empleado: '', fecha_compra: new Date().toISOString().split('T')[0], total_compra: 0 });
            setDetallesNuevos([]);
        } catch (error) {
            console.error(error);
            alert('Error al registrar compra.');
        }
    };

    // === DETALLES ===
    const obtenerDetallesCompra = async (id_compra) => {
        try {
            const resp = await fetch('http://localhost:3000/api/detalles_compras');
            if (!resp.ok) throw new Error('Error al cargar detalles');
            const todos = await resp.json();
            const filtrados = todos.filter(d => d.id_compra === parseInt(id_compra));
            const detalles = await Promise.all(
                filtrados.map(async (d) => {
                    try {
                        const r = await fetch(`http://localhost:3000/api/productos/${d.id_producto}`);
                        if (r.ok) {
                            const x = await r.json();
                            return { ...d, nombre_producto: x.nombre_producto || 'N/D' };
                        }
                    } catch (e) {
                        // ignore
                    }
                    return { ...d, nombre_producto: 'N/D' };
                })
            );
            setDetallesNuevos(detalles);
            setMostrarModalDetalles(true);
        } catch (error) {
            console.error(error);
            alert('No se pudieron cargar los detalles.');
        }
    };

    // === EDICIÓN ===
    const abrirModalEdicion = async (compra) => {
        setCompraEnEdicion({ ...compra, fecha_compra: new Date(compra.fecha_compra).toISOString().split('T')[0] });

        const resp = await fetch('http://localhost:3000/api/detalles_compras');
        const todos = await resp.json();
        const detallesRaw = todos.filter(d => d.id_compra === compra.id_compra);
        const detalles = await Promise.all(
            detallesRaw.map(async (d) => {
                try {
                    const r = await fetch(`http://localhost:3000/api/productos/${d.id_producto}`);
                    if (r.ok) {
                        const x = await r.json();
                        return { id_producto: d.id_producto, nombre_producto: x.nombre_producto || 'N/D', cantidad: d.cantidad, precio_unitario: d.precio_unitario };
                    }
                } catch (e) {
                    // ignore
                }
                return { id_producto: d.id_producto, nombre_producto: 'N/D', cantidad: d.cantidad, precio_unitario: d.precio_unitario };
            })
        );

        setDetallesNuevos(detalles);
        setMostrarModalEdicion(true);
    };

    const actualizarCompra = async () => {
        const total = detallesNuevos.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
        try {
            await fetch(`http://localhost:3000/api/actualizarcompras/${compraEnEdicion.id_compra}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...compraEnEdicion, total_compra: total })
            });

            const resp = await fetch('http://localhost:3000/api/detalles_compras');
            const todos = await resp.json();
            const actuales = todos.filter(d => d.id_compra === compraEnEdicion.id_compra);
            for (const d of actuales) {
                await fetch(`http://localhost:3000/api/eliminardetallecompras/${d.id_detalle_compra}`, { method: 'DELETE' });
            }

            for (const d of detallesNuevos) {
                await fetch('http://localhost:3000/api/detalles_compras', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...d, id_compra: compraEnEdicion.id_compra })
                });
            }

            await obtenerCompras();
            setMostrarModalEdicion(false);
            setCompraEnEdicion(null);
            setDetallesNuevos([]);
        } catch (error) {
            console.error(error);
            alert('Error al actualizar.');
        }
    };

    // === ELIMINACIÓN ===
    const abrirModalEliminacion = (compra) => {
        setCompraAEliminar(compra);
        setMostrarModalEliminar(true);
    };

    const eliminarCompra = async () => {
        try {
            await fetch(`http://localhost:3000/api/eliminarcompras/${compraAEliminar.id_compra}`, { method: 'DELETE' });
            await obtenerCompras();
            setMostrarModalEliminar(false);
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar.');
        }
    };
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
                    <Col className="text-end">
                        <Button className="color-boton-registro" onClick={() => setMostrarModalRegistro(true)}>+ Nueva Compra</Button>
                    </Col>
                </Row>
                <Fade cascade triggerOnce delay={10} duration={600}>
                    <TablaCompras
                        compras={comprasPaginadas}
                        cargando={cargando}
                        obtenerDetalles={obtenerDetallesCompra}
                        abrirModalEdicion={abrirModalEdicion}
                        abrirModalEliminacion={abrirModalEliminacion}
                        totalElementos={compras.length} // Total de compras
                        elementosPorPagina={elementosPorPagina} // Elementos por página
                        paginaActual={paginaActual} // Página actual
                        establecerPaginaActual={establecerPaginaActual}
                    />
                </Fade>

                <ModalRegistroCompra
                    mostrar={mostrarModalRegistro}
                    setMostrar={() => setMostrarModalRegistro(false)}
                    nuevaCompra={nuevaCompra}
                    setNuevaCompra={setNuevaCompra}
                    detalles={detallesNuevos}
                    setDetalles={setDetallesNuevos}
                    productos={productos}
                    empleados={empleados}
                    agregarCompra={agregarCompra}
                    hoy={new Date().toISOString().split('T')[0]}
                />

                <ModalEdicionCompra
                    mostrar={mostrarModalEdicion}
                    setMostrar={() => setMostrarModalEdicion(false)}
                    compra={compraEnEdicion}
                    compraEnEdicion={compraEnEdicion}
                    setCompraEnEdicion={setCompraEnEdicion}
                    detalles={detallesNuevos}
                    setDetalles={setDetallesNuevos}
                    productos={productos}
                    empleados={empleados}
                    actualizarCompra={actualizarCompra}
                    hoy={new Date().toISOString().split('T')[0]}
                />

                <ModalDetallesCompra
                    mostrarModal={mostrarModalDetalles}
                    setMostrarModal={() => setMostrarModalDetalles(false)}
                    detalles={detallesNuevos}
                />

                <ModalEliminacionCompra
                    mostrar={mostrarModalEliminar}
                    setMostrar={() => setMostrarModalEliminar(false)}
                    compra={compraAEliminar}
                    confirmarEliminacion={eliminarCompra}
                />
            </Container>
            <Col lg={3} md={4} sm={4} xs={5}>
                <Button
                    className="mb-3"
                    onClick={generarPDFCompras}
                    variant="secondary"
                    style={{ width: "100%" }}
                >
                    Generar reporte PDF
                </Button>
            </Col>
        </>
    );
};
export default Compras;

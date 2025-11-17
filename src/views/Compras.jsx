// src/views/Compras.jsx
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Fade } from "react-awesome-reveal";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5;

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

    const [nuevaCompra, setNuevaCompra] = useState({ 
        id_empleado: '', 
        fecha_compra: new Date().toISOString().split('T')[0], 
        total_compra: 0 
    });
    const [compraEnEdicion, setCompraEnEdicion] = useState(null);
    const [compraAEliminar, setCompraAEliminar] = useState(null);
    const [detallesNuevos, setDetallesNuevos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    // === PDF morado ===
    const generarPDFCompras = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(128, 0, 128); // morado
        doc.text("Lista de Compras", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

        const columnas = ["ID", "Empleado", "Fecha", "Total"];
        const filas = comprasFiltradas.map(c => [
            c.id_compra,
            c.id_empleado,
            c.fecha_compra,
            `C$ ${c.total_compra}`
        ]);

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 30,
            headStyles: { fillColor: [128, 0, 128], textColor: 255 },
            styles: { textColor: [128, 0, 128] }
        });

        doc.save(`Compras_${new Date().toLocaleDateString()}.pdf`);
    };

    // === Excel morado ===
    const exportarExcelCompras = () => {
        const datos = comprasFiltradas.map(c => ({
            ID: c.id_compra,
            Empleado: c.id_empleado,
            Fecha: c.fecha_compra,
            Total: c.total_compra
        }));

        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Compras");
        XLSX.writeFile(wb, `Compras_${new Date().toLocaleDateString()}.xlsx`);
    };

    // === API ===
    const obtenerCompras = async () => {
        try {
            const resp = await fetch("http://localhost:3000/api/compras");
            if (!resp.ok) throw new Error("Error al obtener compras");
            const datos = await resp.json();
            setCompras(datos);
            setComprasFiltradas(datos);
            setCargando(false);
        } catch (error) {
            console.error(error);
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

    // === Búsqueda ===
    const manejarCambioBusqueda = (e) => setTextoBusqueda(e.target.value.toLowerCase());

    useEffect(() => {
        obtenerCompras();
        obtenerProductos();
        obtenerEmpleados();
    }, []);

    useEffect(() => {
        if (textoBusqueda.trim() === "") {
            setComprasFiltradas(compras);
        } else {
            const filtradas = compras.filter(c =>
                String(c.id_empleado).toLowerCase().includes(textoBusqueda) ||
                String(c.id_cliente || '').toLowerCase().includes(textoBusqueda) ||
                String(c.fecha_compra).toLowerCase().includes(textoBusqueda) ||
                String(c.total_compra).toLowerCase().includes(textoBusqueda)
            );
            setComprasFiltradas(filtradas);
        }
    }, [textoBusqueda, compras]);

    return (
        <Container className="mt-4">
            <h4>Compras</h4>
            <Row className="mb-3">
                <Col lg={5} md={8} sm={8} xs={7}>
                    <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
                </Col>
                <Col className="text-end d-flex gap-2 flex-wrap">
                    <Button
                        style={{
                            backgroundColor: "#800080",
                            borderColor: "#800080",
                            borderRadius: "1rem",
                            transition: "all 0.2s",
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#5a005a"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#800080"}
                        onClick={generarPDFCompras}
                    >
                        <FaFilePdf className="me-1" /> PDF
                    </Button>

                    <Button
                        style={{
                            backgroundColor: "#800080",
                            borderColor: "#800080",
                            borderRadius: "1rem",
                            transition: "all 0.2s",
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#5a005a"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#800080"}
                        onClick={exportarExcelCompras}
                    >
                        <FaFileExcel className="me-1" /> Excel
                    </Button>

                    <Button
                        style={{
                            backgroundColor: "#800080",
                            borderColor: "#800080",
                            borderRadius: "1rem",
                            transition: "all 0.2s",
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#5a005a"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "#800080"}
                        onClick={() => setMostrarModalRegistro(true)}
                    >
                        + Nueva Compra
                    </Button>
                </Col>
            </Row>

            <Fade cascade triggerOnce delay={10} duration={600}>
                <TablaCompras
                    compras={comprasPaginadas}
                    cargando={cargando}
                    obtenerDetalles={() => {}}
                    abrirModalEdicion={() => {}}
                    abrirModalEliminacion={() => {}}
                    totalElementos={comprasFiltradas.length}
                    elementosPorPagina={elementosPorPagina}
                    paginaActual={paginaActual}
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
            />

            <ModalEdicionCompra
                mostrar={mostrarModalEdicion}
                setMostrar={() => setMostrarModalEdicion(false)}
                compra={compraEnEdicion}
                setCompraEnEdicion={setCompraEnEdicion}
                detalles={detallesNuevos}
                setDetalles={setDetallesNuevos}
                productos={productos}
                empleados={empleados}
            />

            <ModalEliminacionCompra
                mostrar={mostrarModalEliminar}
                setMostrar={() => setMostrarModalEliminar(false)}
                compra={compraAEliminar}
            />

            <ModalDetallesCompra
                mostrarModal={mostrarModalDetalles}
                setMostrarModal={() => setMostrarModalDetalles(false)}
                detalles={detallesNuevos}
            />
        </Container>
    );
};

export default Compras;

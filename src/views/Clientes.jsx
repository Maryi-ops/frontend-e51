import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaClientes from "../components/clientes/TablaClientes";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCliente from "../components/clientes/ModalRegistroCliente.jsx";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";

// Dependencias para PDF y Excel
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Íconos
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

    const [clienteEditado, setClienteEditado] = useState(null);
    const [clienteAEliminar, setClienteAEliminar] = useState(null);

    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5;

    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaCliente, setNuevaCliente] = useState({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        celular: '',
        direccion: '',
        cedula: ''
    });

    // Paginación
    const clientesPaginadas = clientesFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevaCliente(prev => ({ ...prev, [name]: value }));
    };

    const abrirModalEdicion = (cliente) => {
        setClienteEditado({ ...cliente });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!String(clienteEditado?.primer_nombre ?? "").trim()) return;
        try {
            const respuesta = await fetch(`http://localhost:3000/api/actualizarclientes/${clienteEditado.id_cliente}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteEditado)
            });
            if (!respuesta.ok) throw new Error('Error al actualizar');
            setMostrarModalEdicion(false);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al editar cliente:", error);
            alert("No se pudo actualizar el cliente.");
        }
    };

    const abrirModalEliminacion = (cliente) => {
        setClienteAEliminar(cliente);
        setMostrarModalEliminar(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/eliminarclientes/${clienteAEliminar.id_cliente}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error('Error al eliminar');
            setMostrarModalEliminar(false);
            setClienteAEliminar(null);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
            alert("No se pudo eliminar el cliente.");
        }
    };

    const agregarCliente = async () => {
        if (!String(nuevaCliente.primer_nombre ?? "").trim()) return;

        try {
            const respuesta = await fetch('http://localhost:3000/api/registrarclientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCliente)
            });

            if (!respuesta.ok) throw new Error('Error al guardar');

            setNuevaCliente({
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                celular: '',
                direccion: '',
                cedula: ''
            });
            setMostrarModal(false);
            await obtenerClientes();
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            alert("No se pudo guardar el cliente. Revisa la consola.");
        }
    };

    const obtenerClientes = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch("http://localhost:3000/api/clientes");
            if (!respuesta.ok) throw new Error("Error al obtener los Clientes");
            const datos = await respuesta.json();
            setClientes(datos || []);
            setClientesFiltrados(datos || []);
        } catch (error) {
            console.log(error.message);
            setClientes([]);
            setClientesFiltrados([]);
        } finally {
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = String(e.target?.value ?? "").toLowerCase();
        setTextoBusqueda(texto);
        const filtradas = (clientes || []).filter((cliente) => {
            const primer = String(cliente?.primer_nombre ?? "").toLowerCase();
            const segundo = String(cliente?.segundo_nombre ?? "").toLowerCase();
            const pApellido = String(cliente?.primer_apellido ?? "").toLowerCase();
            const sApellido = String(cliente?.segundo_apellido ?? "").toLowerCase();
            const celular = String(cliente?.celular ?? "").toLowerCase();
            const direccion = String(cliente?.direccion ?? "").toLowerCase();
            const cedula = String(cliente?.cedula ?? "").toLowerCase();

            return (
                primer.includes(texto) ||
                segundo.includes(texto) ||
                pApellido.includes(texto) ||
                sApellido.includes(texto) ||
                celular.includes(texto) ||
                direccion.includes(texto) ||
                cedula.includes(texto)
            );
        });
        setClientesFiltrados(filtradas);
    };

    // PDF en morado
    const generarPDFClientes = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(128, 0, 128); // Morado
        doc.text("Lista de Clientes", 14, 20);

        const columnas = ["ID", "Nombre Completo", "Cédula", "Celular", "Dirección"];
        const filas = clientesFiltrados.map(c => [
            c.id_cliente,
            `${c.primer_nombre} ${c.segundo_nombre} ${c.primer_apellido} ${c.segundo_apellido}`,
            c.cedula,
            c.celular,
            c.direccion
        ]);

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 30,
            headStyles: { fillColor: [128, 0, 128] }, // encabezado morado
            styles: { textColor: [128, 0, 128] } // texto morado
        });

        doc.save(`Clientes_${new Date().toLocaleDateString()}.pdf`);
    };

    // Excel en morado
    const exportarExcelClientes = () => {
        const datos = clientesFiltrados.map(c => ({
            ID: c.id_cliente,
            "Nombre Completo": `${c.primer_nombre} ${c.segundo_nombre} ${c.primer_apellido} ${c.segundo_apellido}`,
            Cédula: c.cedula,
            Celular: c.celular,
            Dirección: c.direccion
        }));
        const ws = XLSX.utils.json_to_sheet(datos);

        // Estilo morado en encabezados
        const headerColor = "FF00FF"; // morado
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: 0 };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (!ws[cell_ref]) continue;
            ws[cell_ref].s = {
                fill: { fgColor: { rgb: headerColor } },
                font: { color: { rgb: "FFFFFF" }, bold: true }
            };
        }

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, `Clientes_${new Date().toLocaleDateString()}.xlsx`);
    };

    useEffect(() => {
        obtenerClientes();
    }, []);

    return (
        <Container className="mt-4">
            <h4>Clientes</h4>

            <Row className="mb-3 align-items-center">
                <Col lg={5} md={8} sm={8} xs={7}>
                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={manejarCambioBusqueda}
                    />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2 flex-wrap">
                    <Button
                        size="sm"
                        onClick={generarPDFClientes}
                        style={{ backgroundColor: "#800080", borderColor: "#800080" }}
                    >
                        <FaFilePdf className="me-1" /> PDF
                    </Button>
                    <Button
                        size="sm"
                        onClick={exportarExcelClientes}
                        style={{ backgroundColor: "#800080", borderColor: "#800080" }}
                    >
                        <FaFileExcel className="me-1" /> Excel
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => {
                            setNuevaCliente({
                                primer_nombre: '',
                                segundo_nombre: '',
                                primer_apellido: '',
                                segundo_apellido: '',
                                celular: '',
                                direccion: '',
                                cedula: ''
                            });
                            setMostrarModal(true);
                        }}
                        style={{ backgroundColor: "#800080", borderColor: "#800080" }}
                    >
                        + Nuevo Cliente
                    </Button>
                </Col>
            </Row>

            <TablaClientes
                clientes={clientesPaginadas}
                cargando={cargando}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                totalElementos={clientes.length}
                elementosPorPagina={elementosPorPagina}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
            />

            <ModalRegistroCliente
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoCliente={nuevaCliente}
                manejarCambioInput={manejarCambioInput}
                agregarCliente={agregarCliente}
            />
            <ModalEdicionCliente
                mostrar={mostrarModalEdicion}
                setMostrar={setMostrarModalEdicion}
                clienteEditado={clienteEditado}
                setClienteEditado={setClienteEditado}
                guardarEdicion={guardarEdicion}
            />
            <ModalEliminacionCliente
                mostrar={mostrarModalEliminar}
                setMostrar={setMostrarModalEliminar}
                cliente={clienteAEliminar}
                confirmarEliminacion={confirmarEliminacion}
            />
        </Container>
    );
}

export default Clientes;

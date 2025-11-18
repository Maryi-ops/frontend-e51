// src/views/Empleados.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import TablaEmpleados from '../components/empleados/TablaEmpleados';
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import ModalRegistroEmpleado from '../components/empleados/ModalRegistroEmpleado';
import ModalEdicionEmpleado from '../components/empleados/ModalEdicionEmpleado';
import ModalEliminacionEmpleado from '../components/empleados/ModalEliminacionEmpleado';
import { Zoom } from "react-awesome-reveal";

// PDF y Excel
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Íconos
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [empleadosFiltrados, setEmpleadosFiltrados] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [empleadoEditado, setEmpleadoEditado] = useState(null);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
    const [paginaActual, establecerPaginaActual] = useState(1);
    const elementosPorPagina = 5;
    const hoy = new Date().toISOString().split('T')[0];

    const [nuevoEmpleado, setNuevoEmpleado] = useState({
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        celular: '',
        cargo: '',
        fecha_contratacion: hoy
    });

    const empleadosPaginados = empleadosFiltrados.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        setNuevoEmpleado(prev => ({ ...prev, [name]: value }));
    };

    const agregarEmpleado = async () => {
        if (!nuevoEmpleado.primer_nombre.trim() || !nuevoEmpleado.primer_apellido.trim()) return;
        try {
            const respuesta = await fetch('http://localhost:3000/api/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEmpleado)
            });
            if (!respuesta.ok) throw new Error('Error al guardar');
            setNuevoEmpleado({
                primer_nombre: '',
                segundo_nombre: '',
                primer_apellido: '',
                segundo_apellido: '',
                celular: '',
                cargo: '',
                fecha_contratacion: hoy
            });
            setMostrarModal(false);
            await obtenerEmpleados();
        } catch (error) {
            console.error("Error al agregar empleado:", error);
            alert("No se pudo guardar el empleado. Revisa la consola.");
        }
    };

    const obtenerEmpleados = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/empleados');
            if (!respuesta.ok) throw new Error('Error al obtener empleados');
            const datos = await respuesta.json();
            setEmpleados(datos);
            setEmpleadosFiltrados(datos);
            setCargando(false);
        } catch (error) {
            console.error(error.message);
            setCargando(false);
        }
    };

    const manejarCambioBusqueda = (e) => {
        const texto = e.target.value.toLowerCase();
        setTextoBusqueda(texto);
        const filtrados = empleados.filter(emp =>
            `${emp.primer_nombre} ${emp.segundo_nombre} ${emp.primer_apellido} ${emp.segundo_apellido}`.toLowerCase().includes(texto) ||
            emp.cargo.toLowerCase().includes(texto) ||
            emp.celular.includes(texto)
        );
        setEmpleadosFiltrados(filtrados);
    };

    const abrirModalEdicion = (empleado) => {
        setEmpleadoEditado({ ...empleado });
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async () => {
        if (!empleadoEditado.primer_nombre.trim() || !empleadoEditado.primer_apellido.trim()) return;
        try {
            const respuesta = await fetch(`http://localhost:3000/api/actualizarempleados/${empleadoEditado.id_empleado}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(empleadoEditado)
            });
            if (!respuesta.ok) throw new Error('Error al actualizar');
            setMostrarModalEdicion(false);
            await obtenerEmpleados();
        } catch (error) {
            console.error("Error al editar empleado:", error);
            alert("No se pudo actualizar el empleado.");
        }
    };

    const abrirModalEliminacion = (empleado) => {
        setEmpleadoAEliminar(empleado);
        setMostrarModalEliminar(true);
    };

    const confirmarEliminacion = async () => {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/eliminarempleados/${empleadoAEliminar.id_empleado}`, {
                method: 'DELETE',
            });
            if (!respuesta.ok) throw new Error('Error al eliminar');
            setMostrarModalEliminar(false);
            setEmpleadoAEliminar(null);
            await obtenerEmpleados();
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            alert("No se pudo eliminar el empleado. Puede estar en uso.");
        }
    };

    // PDF morado
    const generarPDFEmpleados = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(128, 0, 128);
        doc.text("Lista de Empleados", doc.internal.pageSize.getWidth()/2, 20, { align: "center" });

        const columnas = ["ID", "Nombre Completo", "Cargo", "Celular", "Fecha Contratación"];
        const filas = empleadosFiltrados.map(emp => [
            emp.id_empleado,
            `${emp.primer_nombre} ${emp.segundo_nombre} ${emp.primer_apellido} ${emp.segundo_apellido}`,
            emp.cargo,
            emp.celular,
            emp.fecha_contratacion
        ]);

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 30,
            headStyles: { fillColor: [128,0,128], textColor: 255 },
            styles: { textColor: [128,0,128] }
        });

        doc.save(`Empleados_${new Date().toLocaleDateString()}.pdf`);
    };

    // Excel morado
    const exportarExcelEmpleados = () => {
        const datos = empleadosFiltrados.map(emp => ({
            ID: emp.id_empleado,
            "Nombre Completo": `${emp.primer_nombre} ${emp.segundo_nombre} ${emp.primer_apellido} ${emp.segundo_apellido}`,
            Cargo: emp.cargo,
            Celular: emp.celular,
            "Fecha Contratación": emp.fecha_contratacion
        }));
        const ws = XLSX.utils.json_to_sheet(datos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Empleados");
        XLSX.writeFile(wb, `Empleados_${new Date().toLocaleDateString()}.xlsx`);
    };

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    return (
        <Container className="mt-4">
            <h4>Empleados</h4>
            <Row className="mb-3 align-items-center">
                <Col lg={5} md={6} sm={8} xs={12}>
                    <CuadroBusquedas
                        textoBusqueda={textoBusqueda}
                        manejarCambioBusqueda={manejarCambioBusqueda}
                    />
                </Col>
                <Col className="text-end d-flex justify-content-end gap-2 flex-wrap">
                    <Button
                        style={{ backgroundColor: "#800080", borderColor: "#800080", borderRadius: "1rem" }}
                        onClick={generarPDFEmpleados}
                    >
                        <FaFilePdf className="me-1" /> PDF
                    </Button>
                    <Button
                        style={{ backgroundColor: "#800080", borderColor: "#800080", borderRadius: "1rem" }}
                        onClick={exportarExcelEmpleados}
                    >
                        <FaFileExcel className="me-1" /> Excel
                    </Button>
                    <Button
                        style={{ backgroundColor: "#800080", borderColor: "#800080", borderRadius: "1rem" }}
                        onClick={() => setMostrarModal(true)}
                    >
                        + Nuevo Empleado
                    </Button>
                </Col>
            </Row>
            
            <TablaEmpleados
                empleados={empleadosPaginados}
                cargando={cargando}
                abrirModalEdicion={abrirModalEdicion}
                abrirModalEliminacion={abrirModalEliminacion}
                totalElementos={empleadosFiltrados.length}
                elementosPorPagina={elementosPorPagina}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
            />

            <ModalRegistroEmpleado
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                nuevoEmpleado={nuevoEmpleado}
                manejarCambioInput={manejarCambioInput}
                agregarEmpleado={agregarEmpleado}
            />

            <ModalEdicionEmpleado
                mostrar={mostrarModalEdicion}
                setMostrar={setMostrarModalEdicion}
                empleadoEditado={empleadoEditado}
                setEmpleadoEditado={setEmpleadoEditado}
                guardarEdicion={guardarEdicion}
            />

            <ModalEliminacionEmpleado
                mostrar={mostrarModalEliminar}
                setMostrar={setMostrarModalEliminar}
                empleado={empleadoAEliminar}
                confirmarEliminacion={confirmarEliminacion}
            />
        </Container>
    );
};

export default Empleados;

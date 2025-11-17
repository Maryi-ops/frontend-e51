// src/views/Categorias.jsx
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCategorias from "../components/categorias/TablaCategorias";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategorias";
import ModalEdicionCategoria from '../components/categorias/ModalEdicionCategoria';
import ModalEliminacionCategoria from '../components/categorias/ModalEliminacionCategoria';

// Dependencias para PDF y Excel
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Íconos
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [categoriaEditada, setCategoriaEditada] = useState(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [paginaActual, establecerPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const agregarCategoria = async () => {
    if (!String(nuevaCategoria.nombre_categoria ?? "").trim()) return;

    try {
      const respuesta = await fetch("http://localhost:3000/api/registrarcategoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCategoria),
      });

      if (!respuesta.ok) throw new Error("Error al guardar");

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await obtenerCategorias();
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert("No se pudo guardar la categoría.");
    }
  };

  const obtenerCategorias = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch("http://localhost:3000/api/categorias");
      if (!respuesta.ok) throw new Error("Error al obtener las categorias");
      const datos = await respuesta.json();
      setCategorias(datos || []);
      setCategoriasFiltradas(datos || []);
    } catch (error) {
      console.error(error);
      setCategorias([]);
      setCategoriasFiltradas([]);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const texto = String(e.target.value ?? "").toLowerCase();
    setTextoBusqueda(texto);
    const filtradas = categorias.filter((categoria) => {
      const nombre = String(categoria?.nombre_categoria ?? "").toLowerCase();
      const descripcion = String(categoria?.descripcion_categoria ?? "").toLowerCase();
      return nombre.includes(texto) || descripcion.includes(texto);
    });
    setCategoriasFiltradas(filtradas);
  };

  const abrirModalEdicion = (categoria) => {
    setCategoriaEditada({ ...categoria });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!categoriaEditada.nombre_categoria.trim()) return;
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarcategoria/${categoriaEditada.id_categoria}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoriaEditada)
        }
      );
      if (!respuesta.ok) throw new Error('Error al actualizar');
      setMostrarModalEdicion(false);
      await obtenerCategorias();
    } catch (error) {
      console.error("Error al editar categoría:", error);
      alert("No se pudo actualizar la categoría.");
    }
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarcategoria/${categoriaAEliminar.id_categoria}`,
        { method: 'DELETE' }
      );
      if (!respuesta.ok) throw new Error('Error al eliminar');
      setMostrarModalEliminar(false);
      setCategoriaAEliminar(null);
      await obtenerCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("No se pudo eliminar la categoría.");
    }
  };

  // PDF morado
  const generarPDFCategorias = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(128,0,128); // morado
    doc.text("Lista de Categorías", doc.internal.pageSize.getWidth()/2, 20, { align: "center" });

    const columnas = ["ID", "Nombre", "Descripción"];
    const filas = categoriasFiltradas.map((c) => [
      c.id_categoria,
      c.nombre_categoria,
      c.descripcion_categoria
    ]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 30,
      headStyles: { fillColor: [128,0,128], textColor: 255 },
      styles: { textColor: [128,0,128] }
    });

    doc.save(`Categorias_${new Date().toLocaleDateString()}.pdf`);
  };

  // Excel morado
  const exportarExcelCategorias = () => {
    const datos = categoriasFiltradas.map((c) => ({
      ID: c.id_categoria,
      Nombre: c.nombre_categoria,
      Descripción: c.descripcion_categoria
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const range = XLSX.utils.decode_range(ws['!ref']);
    const headerColor = "800080"; // morado
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
    XLSX.utils.book_append_sheet(wb, ws, "Categorias");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Categorias_${new Date().toLocaleDateString()}.xlsx`);
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Categorías</h4>

      <Row className="mb-3 align-items-center">
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
        </Col>
        <Col className="text-end d-flex justify-content-end gap-2 flex-wrap">
          <Button
            style={{ backgroundColor: "#800080", borderColor: "#800080", borderRadius: "1rem" }}
            size="sm"
            onClick={generarPDFCategorias}
          >
            <FaFilePdf className="me-1" /> PDF
          </Button>
          <Button
            style={{ backgroundColor: "#800080", borderColor: "#800080", borderRadius: "1rem" }}
            size="sm"
            onClick={exportarExcelCategorias}
          >
            <FaFileExcel className="me-1" /> Excel
          </Button>
          <Button
            style={{ backgroundColor: "#800080", borderColor: "#800080", borderRadius: "1rem" }}
            onClick={() => {
              setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
              setMostrarModal(true);
            }}
          >
            + Nueva Categoría
          </Button>
        </Col>
      </Row>

      <TablaCategorias
        categorias={categoriasPaginadas}
        cargando={cargando}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
        totalElementos={categorias.length}
        elementosPorPagina={elementosPorPagina}
        paginaActual={paginaActual}
        establecerPaginaActual={establecerPaginaActual}
      />

      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejarCambioInput={manejarCambioInput}
        agregarCategoria={agregarCategoria}
      />
      <ModalEdicionCategoria
        mostrar={mostrarModalEdicion}
        setMostrar={setMostrarModalEdicion}
        categoriaEditada={categoriaEditada}
        setCategoriaEditada={setCategoriaEditada}
        guardarEdicion={guardarEdicion}
      />
      <ModalEliminacionCategoria
        mostrar={mostrarModalEliminar}
        setMostrar={setMostrarModalEliminar}
        categoria={categoriaAEliminar}
        confirmarEliminacion={confirmarEliminacion}
      />
    </Container>
  );
};

export default Categorias;

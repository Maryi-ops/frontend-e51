// src/views/Productos.jsx
import { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import TablaProductos from "../components/productos/TablaProductos";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";

// Dependencias PDF y Excel
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Íconos
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

// Fondo
const fondoFerreteria =
  "https://i.pinimg.com/1200x/02/b0/43/02b043af51095195be4e910dad3cf54b.jpg";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    id_categoria: "",
    precio_unitario: "",
    stock: "",
    imagen: "",
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [productoAEliminado, setProductoEliminado] = useState(null);

  // Obtener productos desde API
  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch("http://localhost:3000/api/productos");
      if (!respuesta.ok) throw new Error("Error al obtener productos");
      const datos = await respuesta.json();
      setProductos(datos);
      setProductosFiltrados(datos);
    } catch (error) {
      console.error(error.message);
      setProductos([]);
      setProductosFiltrados([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Búsqueda
  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = productos.filter(
      (p) =>
        p.nombre_producto.toLowerCase().includes(texto) ||
        p.descripcion_producto.toLowerCase().includes(texto) ||
        String(p.id_categoria).includes(texto) ||
        String(p.precio_unitario).includes(texto) ||
        String(p.stock).includes(texto)
    );
    setProductosFiltrados(filtrados);
  };

  // Inputs
  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar producto
  const agregarProducto = async () => {
    if (!nuevoProducto.nombre_producto.trim()) return;
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
        imagen: "",
      });
      setMostrarModal(false);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo guardar el producto.");
    }
  };

  // Edición
  const abrirModalEdicion = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEdicion(true);
  };

  const guardarEdicion = async () => {
    if (!productoEditado.nombre_producto.trim()) return;
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/actualizarproductos/${productoEditado.id_producto}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoEditado),
        }
      );
      if (!respuesta.ok) throw new Error("Error al actualizar");
      setMostrarModalEdicion(false);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el producto.");
    }
  };

  // Eliminación
  const abrirModalEliminacion = (producto) => {
    setProductoEliminado(producto);
    setMostrarModalEliminacion(true);
  };

  const confirmarEliminacion = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eliminarproductos/${productoAEliminado.id_producto}`,
        { method: "DELETE" }
      );
      if (!respuesta.ok) throw new Error("Error al eliminar");
      setMostrarModalEliminacion(false);
      setProductoEliminado(null);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    }
  };

  // PDF
  const generarPDFProductos = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lista de Productos", 14, 20);

    const columnas = ["ID", "Nombre", "Descripción", "Categoría", "Precio", "Stock"];
    const filas = productosFiltrados.map((p) => [
      p.id_producto,
      p.nombre_producto,
      p.descripcion_producto,
      p.id_categoria,
      `$${p.precio_unitario}`,
      p.stock,
    ]);

    doc.autoTable({ head: [columnas], body: filas, startY: 30 });
    doc.save(`Productos_${new Date().toLocaleDateString()}.pdf`);
  };

  // Excel
  const exportarExcelProductos = () => {
    const datos = productosFiltrados.map((p) => ({
      ID: p.id_producto,
      Nombre: p.nombre_producto,
      Descripción: p.descripcion_producto,
      Categoría: p.id_categoria,
      Precio: p.precio_unitario,
      Stock: p.stock,
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Productos_${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${fondoFerreteria})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <Container className="p-4 rounded-4 shadow-lg" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
        <h4 className="text-center mb-4">Gestión de Productos</h4>

        <Row className="mb-3 align-items-center">
          <Col md={6} className="mb-2 mb-md-0">
            <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
          </Col>
          <Col md={6} className="text-end d-flex justify-content-end gap-2 flex-wrap">
            <Button style={{ backgroundColor: "#800080", borderColor: "#800080" }} size="sm" onClick={generarPDFProductos}>
              <FaFilePdf className="me-1" /> PDF
            </Button>
            <Button style={{ backgroundColor: "#800080", borderColor: "#800080" }} size="sm" onClick={exportarExcelProductos}>
              <FaFileExcel className="me-1" /> Excel
            </Button>
            <Button style={{ backgroundColor: "#800080", borderColor: "#800080" }} size="sm" onClick={() => setMostrarModal(true)}>
              + Nuevo
            </Button>
          </Col>
        </Row>

        <div className="table-responsive" style={{ maxHeight: "60vh" }}>
          <TablaProductos
            productos={productosFiltrados}
            cargando={cargando}
            abrirModalEdicion={abrirModalEdicion}
            abrirModalEliminacion={abrirModalEliminacion}
          />
        </div>

        {/* Modales */}
        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
        />

        <ModalEdicionProducto
          mostrar={mostrarModalEdicion}
          setMostrar={setMostrarModalEdicion}
          productoEditado={productoEditado}
          setProductoEditado={setProductoEditado}
          guardarEdicion={guardarEdicion}
        />

        <ModalEliminacionProducto
          mostrar={mostrarModalEliminacion}
          setMostrar={setMostrarModalEliminacion}
          productoEliminado={productoAEliminado}
          confirmarEliminacion={confirmarEliminacion}
        />
      </Container>
    </div>
  );
};

export default Productos;
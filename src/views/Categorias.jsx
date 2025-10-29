import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TablaCategorias from "../components/categorias/TablaCategorias";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategorias";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

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

      // Limpiar y cerrar
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);
      await obtenerCategorias(); // Refresca la lista
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      alert("No se pudo guardar la categoría. Revisa la consola.");
    }
  };

  const obtenerCategorias = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch("http://localhost:3000/api/categorias");
      if (!respuesta.ok) {
        throw new Error("Error al obtener las categorias");
      }

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

  useEffect(() => {
    obtenerCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container className="mt-4">
        <h4>Categorías</h4>

        <Row>
          <Col lg={5} md={8} sm={8} xs={7}>
            <CuadroBusquedas textoBusqueda={textoBusqueda} manejarCambioBusqueda={manejarCambioBusqueda} />
          </Col>
          <Col className="text-end">
            <Button
              variant="primary"
              className="color_boton_registrar"
              onClick={() => {
                setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
                setMostrarModal(true);
              }}
            >
              + Nueva Categoría
            </Button>
          </Col>
        </Row>

        <TablaCategorias categorias={categoriasFiltradas} cargando={cargando} />

        <ModalRegistroCategoria
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevaCategoria={nuevaCategoria}
          manejarCambioInput={manejarCambioInput}
          agregarCategoria={agregarCategoria}
        />
      </Container>
    </>
  );
};

export default Categorias;
import React, { useState } from "react";
import { Spinner, Table, Button, Pagination } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaProductos = ({ productos, cargando, abrirModalEdicion, abrirModalEliminacion }) => {
    const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 5; // Cambia este número según necesites

    const manejarOrden = (campo) => {
        setOrden((prev) => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
        }));
    };

    if (cargando) {
        return (
            <div className="text-center my-3">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    const productosArray = Array.isArray(productos) ? productos : [];

    const productosOrdenados = productosArray.slice().sort((a, b) => {
        const valorA = a[orden.campo] ?? "";
        const valorB = b[orden.campo] ?? "";

        if (typeof valorA === "number" && typeof valorB === "number") {
            return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
        }

        return orden.direccion === "asc"
            ? String(valorA).localeCompare(String(valorB))
            : String(valorB).localeCompare(String(valorA));
    });

    // Paginación
    const indiceUltimo = paginaActual * productosPorPagina;
    const indicePrimero = indiceUltimo - productosPorPagina;
    const productosPaginados = productosOrdenados.slice(indicePrimero, indiceUltimo);
    const totalPaginas = Math.ceil(productosOrdenados.length / productosPorPagina);

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
                        <BotonOrden campo="nombre_producto" orden={orden} manejarOrden={manejarOrden}>Nombre</BotonOrden>
                        <BotonOrden campo="descripcion_producto" orden={orden} manejarOrden={manejarOrden}>Descripción</BotonOrden>
                        <BotonOrden campo="id_categoria" orden={orden} manejarOrden={manejarOrden}>Categoría</BotonOrden>
                        <BotonOrden campo="precio_unitario" orden={orden} manejarOrden={manejarOrden}>Precio Unitario</BotonOrden>
                        <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>Stock</BotonOrden>
                        <th className="text-center">Imagen</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {productosPaginados.map((producto) => (
                        <tr key={producto.id_producto}>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.descripcion_producto}</td>
                            <td>{producto.id_categoria}</td>
                            <td>${producto.precio_unitario}</td>
                            <td>{producto.stock}</td>

                            <td className="text-center">
                                {producto.imagen ? (
                                    <img
                                        src={
                                            producto.imagen.startsWith("data:image")
                                                ? producto.imagen
                                                : `data:image/png;base64,${producto.imagen}`
                                        }
                                        alt={producto.nombre_producto}
                                        width={50}
                                        height={50}
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <span className="text-muted">Sin imagen</span>
                                )}
                            </td>

                            <td className="text-center d-flex justify-content-center gap-2 flex-wrap">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => abrirModalEdicion(producto)}
                                    title="Editar producto"
                                >
                                    ✏️ Editar
                                </Button>

                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => abrirModalEliminacion(producto)}
                                    title="Eliminar producto"
                                >
                                    🗑️ Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación */}
            <Pagination className="justify-content-center">
                <Pagination.Prev
                    onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                />
                {[...Array(totalPaginas)].map((_, i) => (
                    <Pagination.Item
                        key={i + 1}
                        active={i + 1 === paginaActual}
                        onClick={() => setPaginaActual(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                />
            </Pagination>
        </>
    );
};

export default TablaProductos;

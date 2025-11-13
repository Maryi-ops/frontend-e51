import React, { useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";


const TablaProductos = ({ productos, cargando }) => {
    const [orden, setOrden] = useState({ campo: "id_producto", direccion: "asc" });

    const manejarOrden = (campo) => {
        setOrden((prev) => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
        }));
    };

    if (cargando) {
        return (
            <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden"> Cargando... </span>
                </Spinner>
            </>
        );
    }

    const productosArray = Array.isArray(productos) ? productos : [];

    const productosOrdenados = productosArray.slice().sort((a, b) => {
        const valorA = a[orden.campo] ?? "";
        const valorB = b[orden.campo] ?? "";

        if (typeof valorA === "number" && typeof valorB === "number") {
            return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
        }

        const comparacion = String(valorA).localeCompare(String(valorB));
        return orden.direccion === "asc" ? comparacion : -comparacion;
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <BotonOrden campo="id_producto" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
                    <BotonOrden campo="nombre_producto" orden={orden} manejarOrden={manejarOrden}>nombre_producto</BotonOrden>
                    <BotonOrden campo="descripcion_producto" orden={orden} manejarOrden={manejarOrden}>descripcion_producto</BotonOrden>
                    <BotonOrden campo="id_categoria" orden={orden} manejarOrden={manejarOrden}>id_categoria</BotonOrden>
                    <BotonOrden campo="precio_unitario" orden={orden} manejarOrden={manejarOrden}>precio_unitario</BotonOrden>
                    <BotonOrden campo="stock" orden={orden} manejarOrden={manejarOrden}>stock</BotonOrden>
                    <BotonOrden campo="imagen" orden={orden} manejarOrden={manejarOrden}>imagen</BotonOrden>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {productosOrdenados.map((producto) => {
                    return (
                        <tr key={producto.id_producto}>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.descripcion_producto}</td>
                            <td>{producto.id_categoria}</td>
                            <td>{producto.precio_unitario}</td>
                            <td>{producto.stock}</td>
                            <td>
                                {producto.imagen ? (
                                    <img
                                        src={`data: image / png;base64,${producto.imagen}`}
                                        alt={producto.nombre_producto}
                                        width={50}
                                        height={50}
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    'Sin imagen'
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table >
    );
};

export default TablaProductos;

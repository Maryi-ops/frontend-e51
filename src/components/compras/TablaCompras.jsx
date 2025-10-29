// ...existing code...
import React, { useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaCompras = ({ compras, cargando }) => {
    const [orden, setOrden] = useState({ campo: "id_compra", direccion: "asc" });

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

    const comprasArray = Array.isArray(compras) ? compras : [];

    const comprasOrdenadas = comprasArray.slice().sort((a, b) => {
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
                    <BotonOrden campo="id_compra" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
                    <BotonOrden campo="id_empleado" orden={orden} manejarOrden={manejarOrden}>id_empleado</BotonOrden>
                    <BotonOrden campo="fecha_compra" orden={orden} manejarOrden={manejarOrden}>fecha_compra</BotonOrden>
                    <BotonOrden campo="total_compra" orden={orden} manejarOrden={manejarOrden}>total_compra</BotonOrden>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {comprasOrdenadas.map((compra) => (
                    <tr key={compra?.id_compra ?? Math.random()}>
                        <td>{compra?.id_compra ?? ""}</td>
                        <td>{compra?.id_empleado ?? ""}</td>
                        <td>{compra?.fecha_compra ?? ""}</td>
                        <td>{compra?.total_compra ?? ""}</td>
                        <td>Accion</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TablaCompras;
// ...existing code...
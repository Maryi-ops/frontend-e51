import React, { useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";


const TablaVentas = ({ ventas, cargando }) => {
    const [orden, setOrden] = useState({ campo: "id_venta", direccion: "asc" });

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

    const ventasArray = Array.isArray(ventas) ? ventas : [];

    const ventasOrdenadas = ventasArray.slice().sort((a, b) => {
        const valorA = a[orden.campo] ?? "";
        const valorB = b[orden.campo] ?? "";

        if (typeof valorA === "number" && typeof valorB === "number") {
            return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
        }

        // Si hay fechas en ISO considerar parsearlas, por ahora comparar como string
        const comparacion = String(valorA).localeCompare(String(valorB));
        return orden.direccion === "asc" ? comparacion : -comparacion;
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <BotonOrden campo="id_venta" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
                    <BotonOrden campo="id_cliente" orden={orden} manejarOrden={manejarOrden}>id_cliente</BotonOrden>
                    <BotonOrden campo="id_empleado" orden={orden} manejarOrden={manejarOrden}>id_empleado</BotonOrden>
                    <BotonOrden campo="fecha_venta" orden={orden} manejarOrden={manejarOrden}>fecha_venta</BotonOrden>
                    <BotonOrden campo="total_venta" orden={orden} manejarOrden={manejarOrden}>total_venta</BotonOrden>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {ventasOrdenadas.map((venta) => (
                    <tr key={venta.id_venta}>
                        <td>{venta.id_venta}</td>
                        <td>{venta.id_cliente}</td>
                        <td>{venta.id_empleado}</td>
                        <td>{venta.fecha_venta}</td>
                        <td>{venta.total_venta}</td>
                        <td>Accion</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TablaVentas;

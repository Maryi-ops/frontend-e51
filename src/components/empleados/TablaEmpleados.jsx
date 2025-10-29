
import React, { useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import BotonOrden from "../ordenamiento/BotonOrden";

const TablaEmpleados = ({ empleados, cargando }) => {
    const [orden, setOrden] = useState({ campo: "id_empleado", direccion: "asc" });

    const manejarOrden = (campo) => {
        setOrden((prev) => ({
            campo,
            direccion: prev.campo === campo && prev.direccion === "asc" ? "desc" : "asc",
        }));
    };

    // Asegurar que tenemos un array seguro
    const empleadosArray = Array.isArray(empleados) ? empleados : [];

    const empleadosOrdenados = empleadosArray.slice().sort((a, b) => {
        const valorA = a[orden.campo] ?? "";
        const valorB = b[orden.campo] ?? "";

        if (typeof valorA === "number" && typeof valorB === "number") {
            return orden.direccion === "asc" ? valorA - valorB : valorB - valorA;
        }

        // Si fueran fechas en formato ISO podría parsearse, por ahora comparar como string
        const comparacion = String(valorA).localeCompare(String(valorB));
        return orden.direccion === "asc" ? comparacion : -comparacion;
    });

    if (cargando) {
        return (
            <>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden"> Cargando... </span>
                </Spinner>
            </>
        );
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <BotonOrden campo="id_empleado" orden={orden} manejarOrden={manejarOrden}>ID</BotonOrden>
                    <BotonOrden campo="primer_nombre" orden={orden} manejarOrden={manejarOrden}>primer_nombre</BotonOrden>
                    <BotonOrden campo="segundo_nombre" orden={orden} manejarOrden={manejarOrden}>segundo_nombre</BotonOrden>
                    <BotonOrden campo="primer_apellido" orden={orden} manejarOrden={manejarOrden}>primer_apellido</BotonOrden>
                    <BotonOrden campo="segundo_apellido" orden={orden} manejarOrden={manejarOrden}>segundo_apellido</BotonOrden>
                    <BotonOrden campo="celular" orden={orden} manejarOrden={manejarOrden}>celular</BotonOrden>
                    <BotonOrden campo="cargo" orden={orden} manejarOrden={manejarOrden}>cargo</BotonOrden>
                    <BotonOrden campo="fecha_contratacion" orden={orden} manejarOrden={manejarOrden}>fecha_contratacion</BotonOrden>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {empleadosOrdenados.map((empleado) => (
                    <tr key={empleado.id_empleado}>
                        <td>{empleado.id_empleado}</td>
                        <td>{empleado.primer_nombre}</td>
                        <td>{empleado.segundo_nombre}</td>
                        <td>{empleado.primer_apellido}</td>
                        <td>{empleado.segundo_apellido}</td>
                        <td>{empleado.celular}</td>
                        <td>{empleado.cargo}</td>
                        <td>{empleado.fecha_contratacion}</td>
                        <td>Accion</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TablaEmpleados;

import React from "react";
import { Pagination, Row, Col } from "react-bootstrap";

const Paginacion = ({ elementosPorPagina, totalElementos, paginaActual, establecerPaginaActual }) => {
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

  // Paleta morada bonita y moderna
  const colorMorado = "#7228A8";        // Morado principal
  const colorHover = "#9333ea";         // Hover más vibrante
  const colorActive = "#5b21b6";        // Fondo activo (morado oscuro)
  const sombra = "0 6px 16px rgba(114, 40, 168, 0.4)";

  const manejarCambioPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      establecerPaginaActual(pagina);
    }
  };

  const itemsPaginacion = [];
  const maxPaginasVisibles = 5;

  let paginaInicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
  let paginaFin = Math.min(totalPaginas, paginaInicio + maxPaginasVisibles - 1);

  if (paginaFin - paginaInicio + 1 < maxPaginasVisibles) {
    paginaInicio = Math.max(1, paginaFin - maxPaginasVisibles + 1);
  }

  for (let pagina = paginaInicio; pagina <= paginaFin; pagina++) {
    itemsPaginacion.push(
      <Pagination.Item
        key={pagina}
        active={pagina === paginaActual}
        onClick={() => manejarCambioPagina(pagina)}
        style={{
          backgroundColor: pagina === paginaActual ? colorActive : "white",
          color: pagina === paginaActual ? "white" : colorMorado,
          borderColor: colorMorado,
          fontWeight: pagina === paginaActual ? "bold" : "600",
          cursor: "pointer",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 5px",
          transition: "all 0.3s ease",
          boxShadow: pagina === paginaActual ? sombra : "none",
        }}
        // Hover solo en páginas NO activas
        onMouseEnter={(e) => {
          if (pagina !== paginaActual) {
            e.currentTarget.style.backgroundColor = colorHover;
            e.currentTarget.style.color = "white";
          }
        }}
        onMouseLeave={(e) => {
          if (pagina !== paginaActual) {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = colorMorado;
          }
        }}
      >
        {pagina}
      </Pagination.Item>
    );
  }

  return (
    <Row className="mt-3">
      <Col className="d-flex justify-content-center">
        <Pagination>
          <Pagination.First
            onClick={() => manejarCambioPagina(1)}
            disabled={paginaActual === 1}
            style={{ color: colorMorado }}
          />
          <Pagination.Prev
            onClick={() => manejarCambioPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            style={{ color: colorMorado }}
          />
          {paginaInicio > 1 && <Pagination.Ellipsis style={{ color: colorMorado }} />}
          {itemsPaginacion}
          {paginaFin < totalPaginas && <Pagination.Ellipsis style={{ color: colorMorado }} />}
          <Pagination.Next
            onClick={() => manejarCambioPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            style={{ color: colorMorado }}
          />
          <Pagination.Last
            onClick={() => manejarCambioPagina(totalPaginas)}
            disabled={paginaActual === totalPaginas}
            style={{ color: colorMorado }}
          />
        </Pagination>

        {/* Esto elimina el azul de Bootstrap por completo */}
        <style jsx>{`
          .page-item.active .page-link {
            background-color: ${colorActive} !important;
            border-color: ${colorActive} !important;
            color: white !important;
            box-shadow: ${sombra} !important;
          }
          .page-link:hover {
            color: white !important;
          }
        `}</style>
      </Col>
    </Row>
  );
};

export default Paginacion;
import { useState } from "react";

export const usePagination = <T>(items: T[], registrosPorPagina: number = 7) => {
  const [paginaActual, setPaginaActual] = useState(1);

  // Lógica de cálculo
  const ultimoIndice = paginaActual * registrosPorPagina;
  const primerIndice = ultimoIndice - registrosPorPagina;
  
  // Lista recortada para la tabla
  const itemsPaginados = items.slice(primerIndice, ultimoIndice);

  // Total de páginas
  const totalPaginas = Math.ceil(items.length / registrosPorPagina);

  // Funciones para cambiar de página
  const irSiguiente = () => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  const irAnterior = () => setPaginaActual((prev) => Math.max(prev - 1, 1));
  const irPagina = (n: number) => setPaginaActual(n);

  return {
    paginaActual,
    totalPaginas,
    itemsPaginados,
    irSiguiente,
    irAnterior,
    irPagina,
    setPaginaActual // Lo exportamos por si necesitas resetear la página al buscar
  };
};
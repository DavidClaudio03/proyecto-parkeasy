/**
 * Calcula el porcentaje de espacios disponibles.
 * @param {number} totalSpaces   Total de plazas en el parqueadero
 * @param {number} occupied      Plazas actualmente ocupadas
 * @returns {number} Porcentaje libre (0–100)
 */
function getAvailabilityPercentage(totalSpaces, occupied) {
  if (totalSpaces <= 0) return 0; // evita división por cero
  const free = totalSpaces - occupied;
  return (free / totalSpaces) * 100;
}

module.exports = { getAvailabilityPercentage };

import parqueaderos from "../data/parqueaderos.json" assert { type: "json" };

export const obtenerParqueaderos = (req, res) => {
  res.json(parqueaderos);
};

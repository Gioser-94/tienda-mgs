export const getAllProducts = async (req, res) => {
  res.json([
    { id: 1, nombre: "Teclado" },
    { id: 2, nombre: "Ratón" }
  ]);
};
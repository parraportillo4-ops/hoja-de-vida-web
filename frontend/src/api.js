
const API_URL = "http://localhost:3000/api/experiencias";

async function solicitar(url, opciones = {}) {
  const respuesta = await fetch(url, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones.headers
    }
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Error en la solicitud");
  }

  return datos;
}

export const experienciasApi = {
  listar: (persona) =>
    solicitar(`${API_URL}/hoja/${persona}`),

  crear: (datos) =>
    solicitar(API_URL, {
      method: "POST",
      body: JSON.stringify(datos)
    }),

  actualizar: (id, datos) =>
    solicitar(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos)
    }),

  eliminar: (id) =>
    solicitar(`${API_URL}/${id}`, {
      method: "DELETE"
    })
};

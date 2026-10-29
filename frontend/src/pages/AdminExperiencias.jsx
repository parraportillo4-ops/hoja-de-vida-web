
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";

const API_URL = "http://localhost:3000/api/experiencias";

const personas = [
  { id: "jhon", nombre: "Jhon" },
  { id: "laura", nombre: "Laura" },
  { id: "samuel", nombre: "Samuel" },
  { id: "lucia", nombre: "Lucía" }
];

const formularioInicial = {
  hojaVida: "jhon",
  empresa: "",
  cargo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  actual: false
};

export default function AdminExperiencias() {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [experiencias, setExperiencias] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] =
    useState("jhon");
  const [idEditando, setIdEditando] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Consulta las experiencias de la persona seleccionada.
  const cargarExperiencias = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(
        `${API_URL}/hoja/${personaSeleccionada}`
      );

      if (!respuesta.ok) {
        throw new Error(
          `Error al consultar las experiencias (${respuesta.status})`
        );
      }

      const datos = await respuesta.json();

      if (!Array.isArray(datos)) {
        throw new Error("La API no devolvió una lista válida.");
      }

      setExperiencias(datos);
    } catch (err) {
      setError(
        `${err.message}. Comprueba que el backend esté funcionando.`
      );
      setExperiencias([]);
    } finally {
      setCargando(false);
    }
  }, [personaSeleccionada]);

  useEffect(() => {
    cargarExperiencias();
  }, [cargarExperiencias]);

  // Actualiza un campo del formulario.
  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  // Limpia el formulario y cancela la edición.
  function limpiarFormulario() {
    setFormulario({
      ...formularioInicial,
      hojaVida: personaSeleccionada
    });

    setIdEditando(null);
    setMensaje("");
    setError("");
  }

  // Crea una experiencia nueva o actualiza una existente.
  async function guardarExperiencia(evento) {
    evento.preventDefault();

    setMensaje("");
    setError("");
    setGuardando(true);

    const datos = {
      ...formulario,
      fechaInicio: formulario.fechaInicio || null,
      fechaFin: formulario.actual
        ? null
        : formulario.fechaFin || null,
      actual: Boolean(formulario.actual)
    };

    try {
      const editando = idEditando !== null;

      const url = editando
        ? `${API_URL}/${idEditando}`
        : API_URL;

      const respuesta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje ||
          resultado.error ||
          `Error HTTP ${respuesta.status}`
        );
      }

      const personaGuardada = formulario.hojaVida;

      setMensaje(
        editando
          ? "Experiencia actualizada correctamente."
          : "Experiencia creada correctamente."
      );

      setIdEditando(null);
      setFormulario({
        ...formularioInicial,
        hojaVida: personaGuardada
      });

      // Si se creó para otra persona, cambiar el filtro
      // para mostrar el registro que acabamos de guardar.
      setPersonaSeleccionada(personaGuardada);

      // Actualizar la tabla desde la API.
      if (personaGuardada === personaSeleccionada) {
        await cargarExperiencias();
      }
    } catch (err) {
      setError(`No fue posible guardar: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  }

  // Copia los datos de una experiencia al formulario.
  function editarExperiencia(experiencia) {
    setFormulario({
      hojaVida: experiencia.hojaVida || personaSeleccionada,
      empresa: experiencia.empresa || "",
      cargo: experiencia.cargo || "",
      descripcion: experiencia.descripcion || "",
      fechaInicio: convertirFecha(experiencia.fechaInicio),
      fechaFin: convertirFecha(experiencia.fechaFin),
      actual: Boolean(experiencia.actual)
    });

    setIdEditando(experiencia._id);
    setMensaje("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Elimina una experiencia después de pedir confirmación.
  async function eliminarExperiencia(experiencia) {
    const confirmar = window.confirm(
      `¿Deseas eliminar la experiencia de ${experiencia.empresa}?`
    );

    if (!confirmar) return;

    setMensaje("");
    setError("");

    try {
      const respuesta = await fetch(
        `${API_URL}/${experiencia._id}`,
        { method: "DELETE" }
      );

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje ||
          resultado.error ||
          `Error HTTP ${respuesta.status}`
        );
      }

      setMensaje("Experiencia eliminada correctamente.");

      if (idEditando === experiencia._id) {
        limpiarFormulario();
      }

      await cargarExperiencias();
    } catch (err) {
      setError(`No fue posible eliminar: ${err.message}`);
    }
  }

  return (
    <main className="container admin-container">
      <nav className="topnav">
        <strong>Administración de hojas de vida</strong>

        <div className="navlinks">
          <Link to="/hoja/jhon">Jhon</Link>
          <Link to="/hoja/laura">Laura</Link>
          <Link to="/hoja/samuel">Samuel</Link>
          <Link to="/hoja/lucia">Lucía</Link>
        </div>
      </nav>

      <header className="page-header">
        <h1>Gestión de experiencias profesionales</h1>
        <p>
          Registra, consulta, actualiza y elimina las
          experiencias profesionales mediante la API REST.
        </p>
      </header>

      {mensaje && (
        <p className="success" role="status">
          {mensaje}
        </p>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <section className="card">
        <h2>
          {idEditando
            ? "Editar experiencia profesional"
            : "Registrar experiencia profesional"}
        </h2>

        <form
          onSubmit={guardarExperiencia}
          className="form-grid"
        >
          <label>
            Hoja de vida
            <select
              name="hojaVida"
              value={formulario.hojaVida}
              onChange={manejarCambio}
              required
            >
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Empresa
            <input
              type="text"
              name="empresa"
              value={formulario.empresa}
              onChange={manejarCambio}
              placeholder="Ej. Empresa ABC"
              maxLength={120}
              required
            />
          </label>

          <label>
            Cargo
            <input
              type="text"
              name="cargo"
              value={formulario.cargo}
              onChange={manejarCambio}
              placeholder="Ej. Desarrollador junior"
              maxLength={120}
              required
            />
          </label>

          <label className="full">
            Descripción de las funciones
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Describe las responsabilidades y actividades..."
              rows={4}
              required
            />
          </label>

          <label>
            Fecha de inicio
            <input
              type="date"
              name="fechaInicio"
              value={formulario.fechaInicio}
              onChange={manejarCambio}
            />
          </label>

          <label>
            Fecha de finalización
            <input
              type="date"
              name="fechaFin"
              value={formulario.fechaFin}
              onChange={manejarCambio}
              disabled={formulario.actual}
              min={formulario.fechaInicio || undefined}
            />
          </label>

          <label className="check-label full">
            <input
              type="checkbox"
              name="actual"
              checked={formulario.actual}
              onChange={manejarCambio}
            />
            Actualmente trabajo en esta empresa
          </label>

          <div className="form-actions full">
            <button type="submit" disabled={guardando}>
              {guardando
                ? "Guardando..."
                : idEditando
                  ? "Guardar cambios"
                  : "Crear experiencia"}
            </button>

            {idEditando && (
              <button
                type="button"
                className="secondary"
                onClick={limpiarFormulario}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="list-heading">
          <h2>Experiencias registradas</h2>

          <label>
            Consultar hoja de vida
            <select
              value={personaSeleccionada}
              onChange={(evento) => {
                setPersonaSeleccionada(evento.target.value);
                setFormulario({
                  ...formularioInicial,
                  hojaVida: evento.target.value
                });
                setIdEditando(null);
                setMensaje("");
                setError("");
              }}
            >
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        {cargando ? (
          <p>Cargando experiencias...</p>
        ) : experiencias.length === 0 && !error ? (
          <p>No hay experiencias registradas para esta persona.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Empresa y cargo</th>
                  <th>Descripción</th>
                  <th>Periodo</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {experiencias.map((experiencia) => (
                  <tr key={experiencia._id}>
                    <td>
                      <strong>{experiencia.empresa}</strong>
                      <br />
                      {experiencia.cargo}
                    </td>

                    <td>{experiencia.descripcion}</td>

                    <td>
                      {convertirFecha(experiencia.fechaInicio) || "—"}
                      {" – "}
                      {experiencia.actual
                        ? "Actualmente"
                        : convertirFecha(experiencia.fechaFin) || "—"}
                    </td>

                    <td className="actions">
                      <button
                        type="button"
                        onClick={() =>
                          editarExperiencia(experiencia)
                        }
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() =>
                          eliminarExperiencia(experiencia)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="button"
          className="secondary refresh"
          onClick={cargarExperiencias}
          disabled={cargando}
        >
          Actualizar lista
        </button>
      </section>

      
    </main>
  );
}

function convertirFecha(fecha) {
  if (!fecha) return "";

  const valor = String(fecha);
  const coincidencia = valor.match(/^\d{4}-\d{2}-\d{2}/);

  if (coincidencia) return coincidencia[0];

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) return "";

  return fechaConvertida.toISOString().slice(0, 10);
}

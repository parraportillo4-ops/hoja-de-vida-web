
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../index.css";

const API_URL = "http://localhost:3000/api/experiencias";

// Información personal de las cuatro hojas de vida.
const personas = {
  jhon: {
    nombre: "Jhon Anthony Ramon Parra Portillo",
    foto: "/fotos/Jhon.jpeg",
    direccion: "Cereté, Córdoba",
    telefono: "3008975786",
    correo: "parraportillo4@gmail.com",
    perfil:
      "Estudiante de Ingeniería de Software con formación en creación de software y experiencia en atención al cliente y ventas.",
    educacion: [
      {
        titulo: "Ingeniería de Software",
        institucion: "Universidad de Cartagena",
        detalle: "Estudiante universitario"
      },
      {
        titulo: "Tecnología en creación de software",
        institucion: "SENA",
        detalle: "Formación tecnológica"
      }
    ],
    aptitudes: [
      "Atención al cliente",
      "Ventas",
      "Programación",
      "Trabajo en equipo",
      "Responsabilidad"
    ]
  },

  laura: {
    nombre: "Laura Maria Petro Pacheco",
    foto: "/fotos/Laura.jpeg",
    direccion: "Cereté, Cordoba",
    telefono: "3005530874",
    correo: "laura244284@gmail.com",
    perfil:
      "Perfil personal y profesional orientado a la formación académica, el desarrollo de habilidades y el crecimiento profesional.",
    educacion: [
      {
        titulo: "Bachillerato",
        institucion: "Institución educativa Marceliano Polo",
        detalle: "Formación académica"
      }
    ],
    aptitudes: [
      "Liderazgo",
      "Puntualidad",
      "Proactividad",
      "Trabajo en equipo"
    ]
  },

  samuel: {
    nombre: "Samuel",
    foto: "/fotos/Samuel.jpeg",
    direccion: "cereté, Cordoba",
    telefono: "3123342115",
    correo: "ortizsamuel007@gmail.com",
    perfil:
      "Perfil académico y profesional. Completar con la información personal, la formación y los objetivos profesionales.",
    educacion: [
      {
        titulo: "Formación académica",
        institucion: "Marceliano polo",
        detalle: "Actualmente en 2ndo año de ingenieria de software"
      }
    ],
    aptitudes: [
      "Responsabilidad",
      "Trabajo en equipo",
      "Comunicación",
      "Compromiso"
    ]
  },

  lucia: {
    nombre: "Maria Lucia Gonzalez Polo",
    foto: "/fotos/Lucia.jpeg",
    direccion: "Cereté, Cordoba",
    telefono: "3113770080",
    correo: "mgonzalez@unicartagena.edu.com",
    perfil:
      "Estudiante universitaria interesada en su desarrollo académico y profesional, con disposición para aprender y trabajar en equipo.",
    educacion: [
      {
        titulo: "Formación universitaria",
        institucion: "Agregar universidad y programa",
        detalle: "Estudiante universitaria"
      },
      {
        titulo: "Bachillerato",
        institucion: "Institución educativa Cañito de los Sábalos",
        detalle: "Formación académica"
      }
    ],
    aptitudes: [
      "Responsabilidad",
      "Empatía",
      "Trabajo en equipo",
      "Compromiso",
      "Aprendizaje continuo"
    ]
  }
};

export default function HojaVida() {
  const { persona } = useParams();

  const identificador = (persona || "jhon").toLowerCase();
  const perfil = personas[identificador];

  const [experiencias, setExperiencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarExperiencias() {
      setCargando(true);
      setError("");
      setExperiencias([]);

      try {
        const respuesta = await fetch(
          `${API_URL}/hoja/${encodeURIComponent(identificador)}`
        );

        if (!respuesta.ok) {
          throw new Error(
            `La API respondió con el estado ${respuesta.status}`
          );
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error(
            "La API no devolvió una lista de experiencias."
          );
        }

        if (activo) {
          setExperiencias(datos);
        }
      } catch (err) {
        if (activo) {
          setError(
            "No fue posible cargar las experiencias. Verifica que el backend y MongoDB estén funcionando."
          );
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    if (perfil) {
      cargarExperiencias();
    } else {
      setCargando(false);
    }

    return () => {
      activo = false;
    };
  }, [identificador, perfil]);

  if (!perfil) {
    return (
      <main className="container">
        <h1>Hoja de vida no encontrada</h1>
        <p>Selecciona una de las cuatro personas disponibles.</p>
        <Navegacion />
      </main>
    );
  }

  return (
    <main className="container">
      <Navegacion />

      <header className="card profile">
        <img
          className="avatar"
          src={perfil.foto}
          alt={`Fotografía de ${perfil.nombre}`}
        />

        <div>
          <h1>{perfil.nombre}</h1>
          <p>{perfil.perfil}</p>
        </div>
      </header>

      <section className="card">
        <h2>Información personal</h2>

        <Dato etiqueta="Nombre completo" valor={perfil.nombre} />
        <Dato etiqueta="Dirección" valor={perfil.direccion} />
        <Dato etiqueta="Teléfono" valor={perfil.telefono} />
        <Dato etiqueta="Correo electrónico" valor={perfil.correo} />
      </section>

      <section className="card">
        <h2>Experiencia profesional</h2>

        {cargando && <p>Cargando experiencias profesionales...</p>}

        {!cargando && error && (
          <p className="error" role="alert">{error}</p>
        )}

        {!cargando && !error && experiencias.length === 0 && (
          <p>No hay experiencias profesionales registradas.</p>
        )}

        {!cargando && !error && experiencias.map((exp) => (
          <article className="experience" key={exp._id}>
            <h3>{exp.cargo}</h3>
            <h4>{exp.empresa}</h4>

            <p>{exp.descripcion}</p>

            <p>
              <strong>Inicio:</strong>{" "}
              {formatearFecha(exp.fechaInicio)}
            </p>

            <p>
              <strong>Finalización:</strong>{" "}
              {exp.actual
                ? "Actualmente"
                : formatearFecha(exp.fechaFin)}
            </p>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Educación y formación</h2>

        {perfil.educacion.map((estudio, indice) => (
          <article className="experience" key={indice}>
            <h3>{estudio.titulo}</h3>
            <p>{estudio.institucion}</p>
            <p>{estudio.detalle}</p>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Aptitudes y habilidades</h2>

        <ul>
          {perfil.aptitudes.map((aptitud) => (
            <li key={aptitud}>{aptitud}</li>
          ))}
        </ul>
      </section>

     
    </main>
  );
}

function Navegacion() {
  return (
    <nav className="topnav">
      <strong>Hojas de vida</strong>

      <div className="navlinks">
        <Link to="/hoja/jhon">Jhon  </Link>
        <Link to="/hoja/laura">Laura  </Link>
        <Link to="/hoja/samuel">Samuel  </Link>
        <Link to="/hoja/lucia">Lucia  </Link>
        <Link to="/admin/experiencias">
          Administrar experiencias  
        </Link>
      </div>
    </nav>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <p>
      <strong>{etiqueta}:</strong> {valor}
    </p>
  );
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "No especificada";
  }

  const valor = String(fecha);

  // Evita problemas de zona horaria al mostrar fechas YYYY-MM-DD.
  const fechaCorta = valor.match(/^\d{4}-\d{2}-\d{2}/);

  if (fechaCorta) {
    return fechaCorta[0];
  }

  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return "No especificada";
  }

  return fechaConvertida.toLocaleDateString("es-CO");
}

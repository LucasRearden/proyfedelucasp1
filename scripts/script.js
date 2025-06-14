// ----- CLASES -----
class Usuario {
  constructor(nombre, contrasenia, nombrePerro, tamanio) {
    this.nombre = nombre.toLowerCase();
    this.contrasenia = contrasenia;
    this.nombrePerro = nombrePerro;
    this.tamanio = tamanio;
  }

  verificarLogin(nombreInput, passInput) {
    return (
      this.nombre === nombreInput.toLowerCase() &&
      this.contrasenia === passInput
    );
  }
}

class Paseador {
  constructor(idPaseador, nombre, contrasenia, nombreDeUsuario, cupo) {
    this.idPaseador = idPaseador;
    this.nombre = nombre.toLowerCase();
    this.nombreDeUsuario = nombreDeUsuario;
    this.contrasenia = contrasenia;
    this.cupo = cupo;
  }

  verificarLoginPaseador(nombreRecibido, pass) {
    return (
      this.nombreDeUsuario === nombreRecibido.toLowerCase() &&
      this.contrasenia === pass
    );
  }
}

class Sistema {
  constructor() {
    this.usuarios = [
      new Usuario("lucas", "1234", "tobi", "mediano"),
      new Usuario("federico", "1234", "jack", "chico"),
      new Usuario("sofia", "1234", "tom", "grande"),
      new Usuario("maria", "1234", "fifi", "mediano"),
      new Usuario("juan", "1234v", "tito", "chico"),
      new Usuario("ana", "1234", "roro", "grande"),
      new Usuario("tomas", "1234", "kike", "mediano"),
      new Usuario("carla", "1234", "pancho", "chico"),
      new Usuario("emma", "1234", "fer", "grande"),
      new Usuario("leo", "1234", "negrita", "mediano"),
    ];

    this.paseadores = [
      new Paseador(1, "lucasPaseador", "1234", "lu", 8),
      new Paseador(2, "federicoPaseador", "1234", "fede", 12),
      new Paseador(3, "sofiaPaseadora", "1234", "sofi", 9),
      new Paseador(4, "mariaPaseadora", "1234", "mari", 7),
      new Paseador(5, "juanPaseadorr", "1234v", "juancito", 8),
      new Paseador(6, "anaPaseadora", "1234", "anita", 11),
      new Paseador(7, "tomasPaseador", "1234", "tomi", 15),
      new Paseador(8, "carlaPaseadora", "1234", "carla", 10),
      new Paseador(9, "emmaPaseadora", "1234", "emma", 12),
      new Paseador(10, "leoPaseador", "1234", "leito", 13),
    ];

    this.contrataciones = [];
  }

  agregarUsuario(objUsuario) {
    this.usuarios.push(objUsuario);
  }
}

// ----- VARIABLES IMPORTANTES -----
let system = new Sistema();
let usuarioLogueadoActual = null;

// ----- ELEMENTOS -----
const pantallaLogin = document.getElementById("pantalla-login");
const pantallaRegistro = document.getElementById("pantalla-registro");
const pantallaCliente = document.getElementById("pantalla-cliente");
const pantallaPaseador = document.getElementById("pantalla-paseador");

const btnRegisterLogin = document.querySelector(".btnRegistrarse");
const btnVolver = document.querySelector(".btnVolver");
const btnLogin = document.querySelector(".btnLogin");
const btnRegistro = document.querySelector(".btnRegistro");
const btnCerrarSesionCliente = document.querySelector(
  ".btnCerrarSesionCliente"
);
const btnCerrarSesionPaseador = document.querySelector(
  ".btnCerrarSesionPaseador"
);

const lista = document.querySelector(".paseadores-lista");
const contenedorSolicitudes = document.querySelector(".solicitudes-pendientes");
const btnCancelarSolicitud = document.querySelector(".btnCancelarSolicitud");

// ----- UTILIDAD -----
function ocultarPantallas() {
  pantallaLogin.style.display = "none";
  pantallaRegistro.style.display = "none";
  pantallaCliente.style.display = "none";
  pantallaPaseador.style.display = "none";
}

// ----- INICIAL -----
ocultarPantallas();
pantallaLogin.style.display = "flex";

// ----- REGISTRO -----
btnRegisterLogin.addEventListener("click", (e) => {
  e.preventDefault();
  ocultarPantallas();
  pantallaRegistro.style.display = "flex";
});

btnVolver.addEventListener("click", (e) => {
  e.preventDefault();
  ocultarPantallas();
  pantallaLogin.style.display = "flex";
});

btnRegistro.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = document
    .querySelector("#txtNombreUsuRegistro")
    .value.trim()
    .toLowerCase();
  const pass = document.querySelector("#txtContraseniaRegistro").value;
  const perro = document.querySelector("#txtNombrePerroRegistro").value;
  const tamanio = document.querySelector("#slcTamanioPerroRegistro").value;

  if (!nombre || !pass || !perro || tamanio === "0") {
    alert("Por favor, complete todos los campos.");
    return;
  }

  if (system.usuarios.some((u) => u.nombre === nombre)) {
    alert("Ese nombre ya está registrado.");
    return;
  }

  const nuevo = new Usuario(nombre, pass, perro, tamanio);
  system.agregarUsuario(nuevo);
  alert("Registro exitoso. Puede iniciar sesión.");
  ocultarPantallas();
  pantallaLogin.style.display = "flex";
});

// ----- LOGIN -----
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("txtNombreUsuLogin").value.trim();
  const pass = document.getElementById("txtContraseniaLogin").value;

  const user = system.usuarios.find((u) => u.verificarLogin(nombre, pass));
  if (user) {
    usuarioLogueadoActual = user;
    ocultarPantallas();
    pantallaCliente.style.display = "flex";
    document.querySelector(
      ".container-superior-cliente p"
    ).textContent = `Cliente iniciado: ${user.nombre}`;

    const tieneSolicitud = system.contrataciones.some(
      (c) => c.cliente === user.nombre
    );

    if (tieneSolicitud) {
      contenedorSolicitudes.style.display = "block";
      lista.style.display = "none";
      mostrarSolicitudesDelUsuario(user);
    } else {
      contenedorSolicitudes.style.display = "none";
      lista.style.display = "flex";
      mostrarPaseadoresDisponibles(user);
    }
    return;
  }

  const paseador = system.paseadores.find((p) =>
    p.verificarLoginPaseador(nombre, pass)
  );
  if (paseador) {
    ocultarPantallas();
    pantallaPaseador.style.display = "flex";
    document.querySelector(
      ".container-superior-paseador p"
    ).textContent = `Paseador iniciado: ${paseador.nombreDeUsuario}`;

    const columnaIzquierda = document.querySelector(
      ".columna-izquierda-solicitudes"
    );
    columnaIzquierda.innerHTML = "<h3>Solicitudes pendientes</h3>";

    system.contrataciones
      .filter((s) => s.idPaseador === paseador.idPaseador)
      .forEach((s) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><strong>${s.cliente}</strong> solicita paseo para <em>${s.perro}</em> (${s.tamanio})</p>
          <button class="btnAceptarSolicitudPaseador" data-id="${s.id}">Aceptar solicitud</button>
          <button class="btnCancelarSolicitudPaseador" data-id="${s.id}">Cancelar solicitud</button>
          `;
        columnaIzquierda.appendChild(div);
      });

    return;
  }

  alert("Credenciales incorrectas.");
});

// ----- CERRAR SESIÓN -----
btnCerrarSesionCliente.addEventListener("click", () => {
  usuarioLogueadoActual = null;
  ocultarPantallas();
  pantallaLogin.style.display = "flex";
});

btnCerrarSesionPaseador.addEventListener("click", () => {
  ocultarPantallas();
  pantallaLogin.style.display = "flex";
});

// ----- VER CONTRASEÑA -----
document
  .getElementById("btnToggleContraseniaLogin")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.getElementById("txtContraseniaLogin");
    input.type = input.type === "password" ? "text" : "password";
  });

document
  .getElementById("btnToggleContraseniaRegistro")
  .addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.getElementById("txtContraseniaRegistro");
    input.type = input.type === "password" ? "text" : "password";
  });

// ----- MOSTRAR PASEADORES -----
function mostrarPaseadoresDisponibles(usuario) {
  lista.innerHTML = "";

  system.paseadores.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("card-paseador");
    div.innerHTML = `
      <h3>${p.nombre}</h3>
      <p><strong>Usuario:</strong> ${p.nombreDeUsuario}</p>
      <p><strong>Cupo disponible:</strong> ${p.cupo}</p>
      <button class="btnSolicitarPaseo" data-id="${p.idPaseador}">Solicitar paseo</button>
    `;
    lista.appendChild(div);
  });
}

// ----- MOSTRAR SOLICITUDES -----
function mostrarSolicitudesDelUsuario(usuario) {
  contenedorSolicitudes.innerHTML = "<h2>Solicitudes pendientes</h2>";

  const solicitudes = system.contrataciones.filter(
    (s) => s.cliente === usuario.nombre && s.estado === 'pendiente'
  );

  solicitudes.forEach((s) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>Solicitaste a <strong>ID Paseador: ${s.idPaseador}</strong> para <em>${s.perro}</em> (${s.tamanio})</p>
      <p>ID Solicitud: ${s.id} ${s.estado}</p>
      <button class="btnCancelarSolicitud" data-id="${s.cliente}}">Cancelar solicitud</button>
    `;
    contenedorSolicitudes.appendChild(div);
  });
}

// ----- SOLICITAR PASEO (EVENTO UNA SOLA VEZ) -----
lista.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("btnSolicitarPaseo") &&
    usuarioLogueadoActual !== null
  ) {
    const idPaseador = parseInt(e.target.dataset.id);
    const paseadorElegido = system.paseadores.find(
      (p) => p.idPaseador === idPaseador
    );

    const yaPidio = system.contrataciones.some(
      (s) =>
        s.cliente === usuarioLogueadoActual.nombre &&
        s.idPaseador === paseadorElegido.idPaseador
    );

    if (yaPidio) {
      alert("Ya hiciste una solicitud a este paseador.");
      return;
    }

    if (confirm(`¿Solicitar paseo a ${paseadorElegido.nombre}?`)) {
      system.contrataciones.push({
        id: system.contrataciones.length,
        cliente: usuarioLogueadoActual.nombre,
        perro: usuarioLogueadoActual.nombrePerro,
        tamanio: usuarioLogueadoActual.tamanio,
        idPaseador: paseadorElegido.idPaseador,
        estado: "pendiente",
      });

      lista.style.display = "none";
      contenedorSolicitudes.style.display = "block";
      mostrarSolicitudesDelUsuario(usuarioLogueadoActual);

      alert("Solicitud enviada.");
    }
  }
});

// ------- CANCELAR SOLICITUD --------

contenedorSolicitudes.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("btnCancelarSolicitud") &&
    usuarioLogueadoActual !== null
  ) {
    const contratacionACancelar = system.contrataciones.find(
      (c) => c.cliente === usuarioLogueadoActual.nombre
    );
    if (
      confirm(`¿Seguro que quieres cancelar la solicitud?`)
    ) {
      contratacionACancelar.estado = "cancelada";
      lista.style.display = "flex";
      contenedorSolicitudes.style.display = "none";
      mostrarSolicitudesDelUsuario(usuarioLogueadoActual);
      alert("Solicitud cancelada.");
    }
  }
});

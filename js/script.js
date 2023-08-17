let usuarios = {}; 
let usuarioActual = "";
let intentosFallidos = 0;
const intentosMaximos = 3;
let inicioSesionBloqueado = false;


function mostrarCajero() {
  document.getElementById("inicioSesion").style.display = "none";
  document.getElementById("crearUsuario").style.display = "none";
  document.getElementById("cajero").style.display = "block";
  document.getElementById("retirarBtn").disabled = false;
  document.getElementById("consignarBtn").disabled = false;
  document.getElementById("transferirBtn").disabled = false;

  
  const nombreUsuarioActualElement = document.getElementById("nombreUsuarioActual");
  nombreUsuarioActualElement.textContent = usuarios[usuarioActual].nombre;

  const usuarioActualElement = document.getElementById("usuarioActual");
  usuarioActualElement.textContent = usuarios[usuarioActual].usuario;

  mostrarInformacionUsuario();
}

function mostrarFormularioCrearUsuario() {
  document.getElementById("inicioSesion").style.display = "none";
  document.getElementById("crearUsuario").style.display = "block";
}
function validarNombre(nombre) {
  const nombreRegex = /^[a-zA-Z ]+$/;
  return nombreRegex.test(nombre);
}

function validarUsuario(usuario) {
  const usuarioRegex = /^[a-z0-9]{8,12}$/;
  return usuarioRegex.test(usuario);
}

function validarContrasena(contrasena) {
  const contrasenaRegex = /^[0-9]{9,}$/;
  return contrasenaRegex.test(contrasena);
}

function crearUsuario() {
  const nuevoUsuario = document.getElementById("nuevoUsuario").value;
  const nuevaContrasena = document.getElementById("nuevaContrasena").value;
  const nombreUsuario = document.getElementById("nombreUsuario").value;

  if (!validarNombre(nombreUsuario)) {
    showWarningAlert("El nombre solo debe contener letras.");
    return;
  }

  if (!validarUsuario(nuevoUsuario)) {
    showWarningAlert("El usuario debe contener letras minusculas, números , tener entre 8 y 12 caracteres.");
    return;
  }

  if (!validarContrasena(nuevaContrasena)) {
    showWarningAlert("La contraseña debe contener solo números y tener mas de 8 números.");
    return;
  }

  
  if (usuarios.hasOwnProperty(nuevoUsuario)) {
    showWarningAlert("El usuario ya existe. Intenta con otro nombre de usuario.");
    return;
  }


  if (nuevoUsuario === "" || nuevaContrasena === "" || nombreUsuario === "") {
    showWarningAlert("Ingresa un usuario, una contraseña y un nombre válidos.");
    return;
  }

  
  if (usuarios.hasOwnProperty(nuevoUsuario)) {
    showWarningAlert("El usuario ya existe. Intenta con otro nombre de usuario.");
    return;
  }

  usuarios[nuevoUsuario] = {
    nombre: nombreUsuario, 
    usuario:nuevoUsuario,
    contrasena: nuevaContrasena,
    saldo: 0,
    movimientos: []
  };

  usuarioActual = nuevoUsuario; 

  showSuccessAlert("Usuario creado exitosamente.");
  document.getElementById('nuevoUsuario').value = '';
  document.getElementById('nuevaContrasena').value = '';
  document.getElementById('nombreUsuario').value = '';
  mostrarCajero();
}


function iniciarSesion() {
  if (inicioSesionBloqueado) {
    showWarningAlert("El inicio de sesión está bloqueado. Intenta más tarde.");
    return;
  }

  const usuario = document.getElementById("usuario").value;
  const contrasena = document.getElementById("contrasena").value;

  if (!usuarios.hasOwnProperty(usuario)) {
    showWarningAlert("El usuario no está registrado. Intenta con un usuario válido.");
    document.getElementById("usuario").value = "";
    document.getElementById("contrasena").value = "";
    return;
  }

  const usuarioEncontrado = usuarios[usuario];

  if (usuarioEncontrado.contrasena === contrasena) {
    usuarioActual = usuario;
    intentosFallidos = 0; 
    inicioSesionBloqueado = false; 
    mostrarCajero();
  } else {
    intentosFallidos++;

    const intentosRestantes = intentosMaximos - intentosFallidos;

    if (intentosRestantes > 0) {
        showWarningAlert("Usuario o contraseña incorrectos. Intento " + intentosFallidos + " de " + intentosMaximos /*+ ". Intentos restantes: " + intentosRestantes*/);
    } else {
      inicioSesionBloqueado = true; 
      showWarningAlert("Has excedido el número máximo de intentos fallidos. El inicio de sesión está bloqueado.");
    }
  }
}

function validarSesion() {
  if (usuarioActual === "") {
    showWarningAlert("Debes iniciar sesión primero.");
    return false;
  }
  return true;
}

function cerrarSesion() {
  usuarioActual = ""; 
  mostrarFormularioInicioSesion(); 
}
function volverInicioSesion() {
    mostrarFormularioInicioSesion(); 
  }

function mostrarFormularioInicioSesion() {
    document.getElementById("inicioSesion").style.display = "block";
    document.getElementById("cajero").style.display = "none";
    document.getElementById("crearUsuario").style.display = "none";
    document.getElementById("usuario").value = ""; 
    document.getElementById("contrasena").value = "";
  }
  

  /*function mostrarInformacionUsuario() {
    const saldoElement = document.getElementById("saldo");
    saldoElement.textContent = `$${formatoNumero(usuarios[usuarioActual].saldo)} COP`;
    mostrarMovimientos();
  }
  function formatoNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }*/
  
  function mostrarInformacionUsuario() {
  const saldoElement = document.getElementById("saldo");
  saldoElement.textContent = `$${formatoNumero(usuarios[usuarioActual].saldo)} COP`;
  mostrarMovimientos();
}

function formatoNumero(numero) {
  return numero.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

  
function mostrarMovimientos() {
  const movimientosElement = document.getElementById("movimientos");
  movimientosElement.innerHTML = "";

  const movimientos = usuarios[usuarioActual].movimientos;

  for (const movimiento of movimientos) {
    const movimientoDiv = document.createElement("div");
    movimientoDiv.className = "movimiento";

    const descripcion = document.createElement("p");
    descripcion.className = "movimiento-content movimiento-descripcion";
    descripcion.textContent = movimiento.tipo;

    const valor = document.createElement("p");
    valor.className = "movimiento-content movimiento-valor";
    valor.textContent = `$${formatoNumero(movimiento.valor)} COP`;

    const hora = document.createElement("p");
    hora.className = "movimiento-content movimiento-hora";
    hora.textContent = movimiento.hora;

    movimientoDiv.appendChild(descripcion);
    movimientoDiv.appendChild(valor);
    movimientoDiv.appendChild(hora);

    if (movimiento.tipo === 'Transferencia enviada') {
      const usuarioDestino = document.createElement("p");
      usuarioDestino.className = "movimiento-content movimiento-tipo";
      usuarioDestino.textContent = `Usuario destino: ${movimiento.usuarioDestino}`;
      movimientoDiv.appendChild(usuarioDestino);
    } else if (movimiento.tipo === 'Transferencia recibida') {
      const usuarioOrigen = document.createElement("p");
      usuarioOrigen.className = "movimiento-content movimiento-tipo";
      usuarioOrigen.textContent = `Usuario origen: ${movimiento.usuarioOrigen}`;
      movimientoDiv.appendChild(usuarioOrigen);
    }

    movimientosElement.appendChild(movimientoDiv);
  }
}

function retirar() {
  if (!validarSesion()) return;

  const cantidad = parseFloat(document.getElementById('cantidad').value);
  if (isNaN(cantidad) || cantidad <= 0) {
    showWarningAlert("Ingresa una cantidad válida para retirar.");
    document.getElementById("cantidad").value = "";
    return;
  }

  const usuarioEncontrado = usuarios[usuarioActual];
  if (usuarioEncontrado.saldo >= cantidad) {
    usuarioEncontrado.saldo -= cantidad;
    usuarioEncontrado.movimientos.push({ tipo: 'Retiro', valor: cantidad, hora: obtenerHoraActual() });
    mostrarInformacionUsuario();
    showSuccessAlert(`Retiro exitoso. Se retiraron $${formatoNumero(cantidad)} COP`);
  } else {
    showWarningAlert("Saldo insuficiente para realizar el retiro.");
  }
  document.getElementById("cantidad").value = "";
}

function consignar() {
  if (!validarSesion()) return;

  const cantidad = parseFloat(document.getElementById('cantidad').value);
  if (isNaN(cantidad) || cantidad <= 0) {
    showWarningAlert("Ingresa una cantidad válida para consignar.");
    document.getElementById("cantidad").value = ""
    return;
  }

  const usuarioEncontrado = usuarios[usuarioActual];
  usuarioEncontrado.saldo += cantidad;
  const valorConFormato = formatoNumero(cantidad);
  usuarioEncontrado.movimientos.push({ tipo: 'Consignación', valor: cantidad, hora: obtenerHoraActual(), valorFormateado: valorConFormato });
  mostrarInformacionUsuario();
  showSuccessAlert(`Consignación exitosa. Se consigno $${formatoNumero(cantidad)} COP`);

  document.getElementById("cantidad").value = "";
}


function transferirUsuario() {
  if (!validarSesion()) return;

  const cantidad = parseFloat(document.getElementById('transferenciaCantidad').value);
  if (isNaN(cantidad) || cantidad <= 0) {
    showWarningAlert("Ingresa una cantidad válida para transferir.");
    document.getElementById('transferenciaCantidad').value = '';
    document.getElementById('transferenciaUsuario').value = '';
    return;
  }

  const usuarioDestino = document.getElementById('transferenciaUsuario').value;
  if (!usuarios.hasOwnProperty(usuarioDestino)) {
    showWarningAlert("El usuario destino no existe.");
    document.getElementById('transferenciaCantidad').value = '';
    document.getElementById('transferenciaUsuario').value = '';
    return;
  }

  const usuarioOrigen = usuarios[usuarioActual];
  if (usuarioActual === usuarioDestino) {
    showWarningAlert("No puedes transferir fondos hacia la misma cuenta.");
    document.getElementById('transferenciaCantidad').value = '';
    document.getElementById('transferenciaUsuario').value = '';
    return;
  }

  if (usuarioOrigen.saldo >= cantidad) {
    usuarioOrigen.saldo -= cantidad;
    usuarioOrigen.movimientos.push({
      tipo: 'Transferencia enviada',
      valor: cantidad,
      hora: obtenerHoraActual(),
      usuarioDestino: usuarios[usuarioDestino].usuario 
    });

    const usuarioDestinoEncontrado = usuarios[usuarioDestino];
    usuarioDestinoEncontrado.saldo += cantidad;
    usuarioDestinoEncontrado.movimientos.push({
      tipo: 'Transferencia recibida',
      valor: cantidad,
      hora: obtenerHoraActual(),
      usuarioOrigen: usuarioOrigen.usuario 
    });

    mostrarInformacionUsuario();
    showSuccessAlert(`Transferencia exitosa. Se van a transferir $${formatoNumero(cantidad)} COP`);

    document.getElementById('transferenciaCantidad').value = '';
    document.getElementById('transferenciaUsuario').value = '';
  } else {
    showWarningAlert("Saldo insuficiente para realizar la transferencia.");
    document.getElementById('transferenciaCantidad').value = '';
    document.getElementById('transferenciaUsuario').value = '';
  }
}


function obtenerHoraActual() {
  const fechaActual = new Date();
  const mes = fechaActual.toLocaleString("default", { month: "long" });
  const anio = fechaActual.getFullYear();
  const dia = fechaActual.getDate();
  const hora = fechaActual.getHours().toString().padStart(2, '0');
  const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
  const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
  const amPM = hora >= 12 ? "PM" : "AM";
  return `${dia} de ${mes} de ${anio}, ${hora}:${minutos}:${segundos} ${amPM}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const usuariosGuardados = JSON.parse(localStorage.getItem('nombreDeLaClave'));
});
function showSuccessAlert(message) {
    Swal.fire({
      title: 'Cajero Automatico',
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }
function showWarningAlert(message) {
    Swal.fire({
      title: 'Cajero Automatico',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
}
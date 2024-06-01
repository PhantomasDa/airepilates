// profile.js

function cargarNombreUsuario() {
    fetchData('/perfil/usuario')
        .then(usuario => {
            document.getElementById('user_name').textContent = `Bienvenid@, ${usuario.nombre}`;
            document.getElementById('profile_picture').src = usuario.foto_perfil;
        })
        .catch(error => console.error('Error al cargar el nombre del usuario:', error));
}

function cargarProximasClases() {
    fetchData('/perfil/proximas-clases')
        .then(clases => {
            const proximasClasesDiv = document.getElementById('proximas_clases');
            proximasClasesDiv.innerHTML = clases.length === 0 
                ? '<p>No tienes clases reservadas.</p>' 
                : clases.map((clase, index) => {
                    const fechaClase = new Date(clase.fecha_hora);
                    const opcionesFecha = { weekday: 'long', month: 'long', day: 'numeric' };
                    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
                    const fechaFormateada = fechaClase.toLocaleDateString('es-ES', opcionesFecha);
                    const horaFormateada = fechaClase.toLocaleTimeString('es-ES', opcionesHora);
                    const ordinal = index === 0 ? 'Primera' : index === 1 ? 'Segunda' : index === 2 ? 'Tercera' : `${index + 1}ª`;
                    return `<div>${ordinal} clase: ${fechaFormateada} a las ${horaFormateada} <button class="my-button-reservas-2" onclick="reagendarClase(${clase.id})">Reagendar Clase</button></div>`;
                }).join('');
        })
        .catch(error => console.error('Error al cargar las próximas clases:', error));
}

function actualizarClasesDisponibles() {
    fetchData('/perfil/clases-disponibles')
        .then(data => {
            const clasesDisponibles = data.clases_disponibles;
            document.getElementById('clases_disponibles').textContent = `Número de clases disponibles: ${clasesDisponibles}`;
        })
        .catch(error => {
            console.error('Error al cargar las clases disponibles:', error);
            document.getElementById('clases_disponibles').textContent = 'Error al cargar las clases disponibles';
        });
}

function manejarErrorReserva(error) {
    console.error('Error al reservar la clase:', error);
    switch (error.message) {
        case 'No se pueden reservar clases para fechas anteriores al día siguiente':
            mostrarModal('dateErrorModal');
            break;
        case 'Ya tienes una clase registrada en esta fecha':
            mostrarModal('sameDayErrorModal');
            break;
        case 'Ya estás registrado en esta clase':
            mostrarModal('errorModal');
            break;
        default:
            alert('Error al reservar la clase: ' + error.message);
    }
}

function confirmarReserva() {
    const claseId = document.getElementById('claseId').value;
    fetchData('/perfil/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claseId })
    })
    .then(data => {
        const fechaClase = new Date(data.fecha);
        const opcionesFecha = { weekday: 'long', month: 'long', day: 'numeric' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
        const fechaFormateada = fechaClase.toLocaleDateString('es-ES', opcionesFecha);
        const horaFormateada = fechaClase.toLocaleTimeString('es-ES', opcionesHora);
        document.getElementById('confirmationText').textContent = `Felicitaciones! Tu clase ha sido reservada para ${fechaFormateada} a las ${horaFormateada}.`;
        mostrarModal('confirmationModal');
        cerrarPopup();
    })
    .catch(error => {
        if (error.json) {
            error.json().then(errorMessage => {
                manejarErrorReserva({ message: errorMessage });
            });
        } else {
            manejarErrorReserva({ message: error.message });
        }
    });
}

function mostrarReservaPopup(claseId) {
    document.getElementById('claseId').value = claseId;
    document.getElementById('reservaPopup').style.display = 'block';
}

function toggleProximasClases() {
    const proximasClasesDiv = document.getElementById('proximas_clases');
    proximasClasesDiv.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement('div');
    header.classList.add('toggle-header');
    header.textContent = 'Ocultar próximas clases';
    header.onclick = toggleProximasClases;

    const proximasClasesContainer = document.getElementById('proximas_clases');
    proximasClasesContainer.parentNode.insertBefore(header, proximasClasesContainer);
});

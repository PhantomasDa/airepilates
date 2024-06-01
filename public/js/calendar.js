
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});

function initPage() {
    actualizarClasesDisponibles();
    cargarProximasClases();
    cargarNombreUsuario();
    inicializarCalendario();
}

function inicializarCalendario() {
    const calendarEl = document.getElementById('calendario');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        validRange: {
            start: new Date() // Empieza desde hoy
        },
        initialDate: new Date(), // La fecha inicial mostrada es hoy
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        buttonText: {
            today: 'Hoy'
        },
        dateClick: (info) => {
            cargarHorarios(info.dateStr);
            document.querySelectorAll('.fc-daygrid-day.selected-date').forEach(date => date.classList.remove('selected-date'));
            info.dayEl.classList.add('selected-date');
        }
    });
    calendar.render();
}
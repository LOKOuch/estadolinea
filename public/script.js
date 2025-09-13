let establecimientos = [];
const filtro = document.getElementById('filtro');
const contenedor = document.getElementById('establecimientos');
const modal = document.getElementById('modal');
const cerrar = document.getElementById('cerrar');
const ctx = document.getElementById('chart').getContext('2d');
let chart;

cerrar.onclick = () => modal.style.display = 'none';
window.onclick = e => { if(e.target === modal) modal.style.display='none'; };

async function cargarDatos() {
    const res = await fetch('/api/establecimientos');
    establecimientos = await res.json();
    mostrarFiltro();
    mostrarLineas();
}

function mostrarFiltro() {
    filtro.innerHTML = '<option value="todos">Todos</option>';
    establecimientos.forEach(e=>filtro.innerHTML+=`<option value="${e.id}">${e.nombre}</option>`);
}
filtro.onchange = mostrarLineas;

function mostrarLineas() {
    const id = filtro.value;
    contenedor.innerHTML = '';
    establecimientos.forEach(e=>{
        if(id!=='todos' && e.id!==id) return;
        e.lineas.forEach(l=>{
            const div = document.createElement('div');
            div.className = `linea ${l.estado || 'offline'}`;
            div.innerHTML = `<span>${l.numero_linea || l.proveedor}</span>
                             <button onclick="verHistorial(${l.id_linea})">Historial</button>`;
            contenedor.appendChild(div);
        });
    });
}

async function verHistorial(id_linea) {
    const res = await fetch(`/api/historial/${id_linea}`);
    const datos = await res.json();
    const labels = datos.map(d => new Date(d.fecha_hora).toLocaleTimeString());
    const estados = datos.map(d => d.estado === 'online' ? 1 : 0);

    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type:'line',
        data:{ labels, datasets:[{label:'Online=1 / Offline=0', data:estados, borderColor:'blue', fill:false}] },
        options:{ scales:{ y:{ min:0, max:1 } } }
    });
    modal.style.display = 'block';
}

cargarDatos();
setInterval(cargarDatos, 15000);

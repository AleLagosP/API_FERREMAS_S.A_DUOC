const API_URL = 'http://localhost:3000/api/ventas';
let ventasCliente = [];
let ventaSeleccionada = null;

//Mostrar producto y detalle - metodo GET

async function buscarVentas() {
  const id = document.getElementById("buscarCliente").value;
  if (!id) return;

  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  ventasCliente = data;

  const lista = document.getElementById("listaVentas");
  lista.innerHTML = "";
  document.getElementById("listaVentasCard").style.display = "block";
  document.getElementById("detalleVentaCard").style.display = "none";

  data.forEach(v => {
    const item = document.createElement("li");
    item.classList.add("list-group-item", "list-group-item-action");
    item.textContent = `Venta #${v.cod_venta} - ${new Date(v.fecha_venta).toLocaleString()}`;
    item.onclick = () => mostrarDetalleVenta(v.cod_venta);
    lista.appendChild(item);
  });
  
}

function mostrarDetalleVenta(cod_venta) {
  const venta = ventasCliente.find(v => v.cod_venta === cod_venta);
  ventaSeleccionada = venta;

  document.getElementById("dv_cod_venta").textContent = venta.cod_venta;
  document.getElementById("dv_id_cliente").textContent = venta.id_cliente;
  document.getElementById("dv_tipo_entrega").textContent = venta.tipo_entrega;
  document.getElementById("dv_fecha_venta").textContent = new Date(venta.fecha_venta).toLocaleString();
  document.getElementById("dv_total").textContent = venta.total_venta.toFixed(2);

  const ul = document.getElementById("dv_productos");
  ul.innerHTML = "";
    venta.productos.forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.dataset.codProducto = p.cod_producto; // <-- IMPORTANTE
    li.dataset.nombreProducto = p.nombre_producto;
    li.dataset.cantidad = p.cantidad;
    li.dataset.precioUnitario = p.precio_unitario;
    li.dataset.totalProducto = p.total_producto;

    li.innerHTML = `
        <strong>Producto:</strong> ${p.nombre_producto} |
        <strong>Cantidad:</strong> ${p.cantidad} |
        <strong>Precio:</strong> $${p.precio_unitario} |
        <strong>Total:</strong> $${p.total_producto}
    `;
    ul.appendChild(li);
    });

  document.getElementById("detalleVentaCard").style.display = "block";
}


//Cargar cliente y producto 

function cargarClientes() {
  fetch('http://localhost:5500/api/clientes')
    .then(res => res.json())
    .then(data => {
      const selectCliente = document.getElementById('cliente');
      selectCliente.innerHTML = '<option value="">Selecciona un cliente</option>';
      data.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id_cliente;
        option.textContent = cliente.nombre;
        selectCliente.appendChild(option);
      });
    })
    .catch(err => console.error('Error al cargar clientes:', err));
}

function cargarProductos(selectId = "producto") {
  fetch('http://localhost:5500/api/productos') 
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById(selectId);
      select.innerHTML = '<option value="">Selecciona un producto</option>';
      data.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.cod_producto;
        option.textContent = producto.nombre_producto;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarProductos();
});

//Agregar producto

let productos = [];

function agregarProducto() {
  const select = document.getElementById('producto');
  const cod_producto = parseInt(select.value);
  const nombre = select.options[select.selectedIndex].text;
  const cantidad = parseInt(document.getElementById('cantidad').value);

  if (!cod_producto || cantidad < 1) return;

  // Verifica si ya existe en la lista
  const existente = productos.find(p => p.cod_producto === cod_producto);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    productos.push({ cod_producto, nombre, cantidad });
  }

  renderizarProductos();
}

function renderizarProductos() {
  const lista = document.getElementById('listaProductos');
  lista.innerHTML = '';
  productos.forEach(p => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${p.nombre} x ${p.cantidad}`;
    lista.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ventaForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id_cliente = parseInt(document.getElementById('cliente').value);
    const tipo_entrega = document.getElementById('tipo_entrega').value;

    if (!id_cliente || !tipo_entrega || productos.length === 0) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente,
          tipo_entrega,
          productos 
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Venta registrada. Código: ${data.cod_venta}`);
        productos = [];
        renderizarProductos();
        document.getElementById('ventaForm').reset();
      } else {
        alert('Error al registrar venta: ' + data.mensaje);
      }
    } catch (error) {
      console.error('Error en el POST:', error);
      alert('Ocurrió un error al registrar la venta');
    }
  });
});

//Editar ventas

let productosEditados = [];

function editarVenta() {
  const cod_venta = document.getElementById('dv_cod_venta').textContent;
  const id_cliente = document.getElementById('dv_id_cliente').textContent;
  const tipo_entrega = document.getElementById('dv_tipo_entrega').textContent;

  document.getElementById('edit_cod_venta').value = cod_venta;
  document.getElementById('edit_cliente').value = id_cliente;
  document.getElementById('edit_tipo_entrega').value = tipo_entrega;


  cargarProductos('edit_producto'); 

  productosEditados = [];
  document.querySelectorAll('#dv_productos li').forEach(li => {
    const cod_producto = parseInt(li.dataset.codProducto);
    const nombre = li.dataset.nombreProducto;
    const cantidad = parseInt(li.dataset.cantidad);
    productosEditados.push({ cod_producto, nombre, cantidad });
  });

  renderizarProductosEditados();
  document.activeElement.blur();

  const modal = new bootstrap.Modal(document.getElementById('modalEditarVenta'));
  modal.show();
}


function agregarProductoEditado() {
  const select = document.getElementById('edit_producto');
  const cod_producto = parseInt(select.value);
  const nombre = select.options[select.selectedIndex]?.text || '';
  const cantidad = parseInt(document.getElementById('edit_cantidad').value);

  console.log('Intentando agregar producto:', cod_producto, nombre, cantidad);

  if (isNaN(cod_producto) || cod_producto <= 0) {
    alert("Selecciona un producto válido.");
    return;
  }

  if (isNaN(cantidad) || cantidad < 1) {
    alert("Ingresa una cantidad válida mayor a 0.");
    return;
  }

  const existente = productosEditados.find(p => p.cod_producto === cod_producto);
  if (existente) {
    existente.cantidad += cantidad; 
  } else {
    productosEditados.push({ cod_producto, nombre, cantidad });
  }

  renderizarProductosEditados();
  
  document.getElementById('edit_cantidad').value = 0;
  
  select.value = ""; 
}

function renderizarProductosEditados() {
  const lista = document.getElementById('edit_lista_productos');
  lista.innerHTML = '';

  productosEditados.forEach((p, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    li.innerHTML = `
      <div>
        <strong>${p.nombre}</strong> x ${p.cantidad}
      </div>
      <div>
        <button class="btn btn-sm btn-warning me-1" onclick="cambiarCantidadProducto(${index})">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarProductoEditado(${index})">🗑️</button>
      </div>
    `;

    lista.appendChild(li);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  const formEditar = document.getElementById('formEditarVenta');
  if (formEditar) {
    formEditar.addEventListener('submit', async function (e) {
      e.preventDefault();
      const cod_venta = document.getElementById('edit_cod_venta').value;

      try {
        const res = await fetch(`http://localhost:3000/api/ventas/${cod_venta}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productos: productosEditados })
        });

        const data = await res.json();
        if (res.ok) {
          alert('Venta actualizada correctamente');
          formEditar.reset();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarVenta')).hide();
          buscarVentas(); // Actualizar lista
        } else {
          alert('Error al actualizar venta: ' + data.mensaje);
        }
      } catch (err) {
        console.error('Error en PUT:', err);
        alert('Error al actualizar la venta');
      }
    });
  }
});

function eliminarProductoEditado(index) {
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    productosEditados.splice(index, 1);
    renderizarProductosEditados();
  }
}

function cambiarCantidadProducto(index) {
  const nuevaCantidad = prompt('Ingrese la nueva cantidad:', productosEditados[index].cantidad);
  const cantidadInt = parseInt(nuevaCantidad);

  if (!isNaN(cantidadInt) && cantidadInt > 0) {
    productosEditados[index].cantidad = cantidadInt;
    renderizarProductosEditados();
  } else {
    alert('Cantidad no válida');
  }
}

// Eliminar venta

async function eliminarVenta() {
  const codVenta = document.getElementById('dv_cod_venta').textContent;

  if (!codVenta) {
    alert('No hay venta seleccionada para eliminar.');
    return;
  }

  const confirmar = confirm(`¿Estás seguro que deseas eliminar la venta #${codVenta}? Esta acción no se puede deshacer.`);
  if (!confirmar) return;

  try {
    const response = await fetch(`http://localhost:3000/api/ventas/${codVenta}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Venta eliminada correctamente.');
      document.getElementById('detalleVentaCard').style.display = 'none';
      document.getElementById('listaVentasCard').style.display = 'none';
      document.getElementById('listaVentas').innerHTML = '';
      document.getElementById('buscarCliente').value = '';
    } else {
      const data = await response.json();
      alert(`Error al eliminar venta: ${data.mensaje || response.statusText}`);
    }
  } catch (error) {
    alert('Error al conectar con el servidor para eliminar la venta.');
    console.error(error);
  }
}


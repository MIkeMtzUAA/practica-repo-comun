// 1. Base de datos simulada de la Papelería
const inventory = [
  { id: 1, name: "Cuaderno Profesional Raya (100 hojas)", category: "Cuadernos", stock: 25 },
  { id: 2, name: "Caja de Bolígrafos Negros (Punto Fino)", category: "Escritura", stock: 4 },
  { id: 3, name: "Juego de Geometría Escolar", category: "Geometría", stock: 0 },
  { id: 4, name: "Pegamento en Barra (40g)", category: "Adhesivos", stock: 12 },
  { id: 5, name: "Tijeras Escolares de Punta Redonda", category: "Corte", stock: 15 },
  { id: 6, name: "Marcadores Permanentemente (Set de 4)", category: "Escritura", stock: 3 },
];

const salesHistory = [];

const tableBody = document.getElementById("inventoryTableBody");
const searchInput = document.getElementById("searchInput");
const salesHistoryTableBody = document.getElementById("salesHistoryTableBody");

// 2. Renderizar tabla con input de cantidad personalizado
function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #777;">No se encontraron productos.</td></tr>`;
    return;
  }

  data.forEach((item) => {
    let badgeClass = "bg-success";
    let stockText = `${item.stock} unidades`;

    if (item.stock === 0) {
      badgeClass = "bg-danger";
      stockText = "Agotado";
    } else if (item.stock <= 5) {
      badgeClass = "bg-warning";
      stockText = `${item.stock} (Bajo stock)`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td><span class="badge ${badgeClass}">${stockText}</span></td>
        <td>
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="number" id="qty-${item.id}" class="qty-input" value="1" min="1" max="${item.stock}">
                <button class="btn-sell" onclick="processSale(${item.id})">Vender</button>
            </div>
        </td>
    `;
    tableBody.appendChild(row);
  });
}

// 3. Renderizar historial de ventas
function renderSalesHistory() {
  salesHistoryTableBody.innerHTML = "";

  if (salesHistory.length === 0) {
    salesHistoryTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #777;">No hay ventas registradas aún.</td></tr>`;
    return;
  }

  salesHistory.forEach((sale, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>#${index + 1}</td>
        <td>${sale.productName}</td>
        <td>${sale.quantity} unidad(es)</td>
        <td>${sale.date}</td>
    `;
    salesHistoryTableBody.appendChild(row);
  });
}

// 4. Leer la cantidad ingresada y procesar la venta
function processSale(productId) {
  const qtyInput = document.getElementById(`qty-${productId}`);
  const quantitySold = parseInt(qtyInput.value);

  if (isNaN(quantitySold) || quantitySold <= 0) {
    alert("Por favor, ingresa una cantidad válida mayor a 0.");
    return;
  }

  registerSale(productId, quantitySold);
}

// 5. Lógica de descuento y registro
function registerSale(productId, quantitySold) {
  const product = inventory.find((item) => item.id === productId);

  if (!product) {
    alert("El producto seleccionado no existe.");
    return false;
  }

  if (product.stock <= 0) {
    alert(`¡Lo sentimos! El producto "${product.name}" está agotado.`);
    return false;
  }

  if (product.stock < quantitySold) {
    alert(`Stock insuficiente. Solo quedan ${product.stock} unidades disponibles de "${product.name}".`);
    return false;
  }

  // Descontar del inventario
  product.stock -= quantitySold;

  // Registrar en el historial
  const now = new Date();
  const timeString = now.toLocaleTimeString() + " - " + now.toLocaleDateString();
  
  salesHistory.push({
    productName: product.name,
    quantity: quantitySold,
    date: timeString
  });

  // Actualizar interfaz manteniendo filtros activos
  const currentSearch = searchInput.value.toLowerCase();
  const currentData = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(currentSearch) ||
      item.category.toLowerCase().includes(currentSearch)
  );
  
  renderTable(currentData);
  renderSalesHistory();

  return true;
}

// 6. Filtrar en tiempo real
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredData = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm),
  );
  renderTable(filteredData);
});

// Carga inicial
renderTable(inventory);
renderSalesHistory();
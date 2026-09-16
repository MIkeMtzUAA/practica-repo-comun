// 1. Base de datos simulada (Array de objetos)
const inventory = [
  { id: 1, name: "Camisa Casual Hombre", category: "Ropa", stock: 15 },
  { id: 2, name: "Pantalón de Mezclilla", category: "Ropa", stock: 4 },
  { id: 3, name: "Tenis Deportivos", category: "Calzado", stock: 0 },
  { id: 4, name: "Mochila Escolar", category: "Accesorios", stock: 8 },
  { id: 5, name: "Gorra Snapback", category: "Accesorios", stock: 22 },
  { id: 6, name: "Chaqueta Impermeable", category: "Ropa", stock: 3 },
];

const tableBody = document.getElementById("inventoryTableBody");
const searchInput = document.getElementById("searchInput");

// 2. Función para renderizar la tabla según los datos
function renderTable(data) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="3" class="empty-message">No se encontraron productos.</td></tr>`;
    return;
  }

  data.forEach((item) => {
    let badgeClass = "bg-success";
    let stockText = `${item.stock} unidades`;

    // Alertas visuales según el nivel de stock
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
                `;
    tableBody.appendChild(row);
  });
}

// 3. Filtrar productos en tiempo real
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredData = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm),
  );
  renderTable(filteredData);
});

// Carga inicial al abrir la página
renderTable(inventory);

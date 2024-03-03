document.addEventListener('DOMContentLoaded', () => {
  const orderTableBody = document.getElementById('orderTableBody');
  const currentPageElement = document.getElementById('currentPage');
  const prevPageButton = document.getElementById('prevPage');
  const nextPageButton = document.getElementById('nextPage');

  let currentPage = 1;
  const itemsPerPage = 10; // Change this to adjust the number of items per page

  // Function to fetch orders from the server
  async function fetchOrders(page) {
    try {
      const response = await fetch(`https://prep50-server.onrender.com/api/orders?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      console.log(data);
      return data.data; // Assuming the response includes an array of orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  // Function to render orders in the table
  async function renderOrders(page) {
    const orders = await fetchOrders(page);
    orderTableBody.innerHTML = ''; // Clear previous orders
    let rowIndex = (page - 1) * itemsPerPage + 1;
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${rowIndex++}</td> 
        <td>${order.fullName}</td>
        <td>${order.email}</td>
        <td>${order.phoneNumber}</td>
        <td>${order.address}</td>
        <td>${order.state}</td>
        <td>${order.orderedProduct}</td>
        <td><input type="checkbox" data-order-id="${order._id}" class="processing-checkbox" ${order.processing ? 'checked' : ''}></td>
        <td><input type="checkbox" data-order-id="${order._id}" class="completed-checkbox" ${order.completed ? 'checked' : ''}></td>
      `;
      orderTableBody.appendChild(row);

      // Add event listeners for checkbox changes
      const processingCheckbox = row.querySelector('.processing-checkbox');
      const completedCheckbox = row.querySelector('.completed-checkbox');
      processingCheckbox.addEventListener('change', () => handleCheckboxChange(order._id, 'process', processingCheckbox.checked));
      completedCheckbox.addEventListener('change', () => handleCheckboxChange(order._id, 'complete', completedCheckbox.checked));
    });
    currentPageElement.textContent = `Page ${page}`;
  }

  // Function to handle checkbox change
  async function handleCheckboxChange(orderId, field, checked) {
    const endpoint = checked ? `${field}` : `un${field}`;
    const url = `https://prep50-server.onrender.com/api/orders/${orderId}/${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [field]: checked })
      });
      if (!response.ok) {
        console.error(`Failed to update ${field} for order ${orderId}`);
      }
    } catch (error) {
      console.error(`Error updating ${field} for order ${orderId}:`, error);
    }
  }

  // Initial render
  renderOrders(currentPage);

  // Event listeners for pagination buttons
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderOrders(currentPage);
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    renderOrders(currentPage);
  });
});

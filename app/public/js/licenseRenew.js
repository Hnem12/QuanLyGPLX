let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchLicenseHolders() {
  try {
    const response = await fetch(`/api/renewals/getall?page=${currentPage}&limit=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { data: renewals, pagination } = data; // Extract renewals and pagination data

    const tableBody = document.getElementById('accountTableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    renewals.forEach((holder, index) => {
      const row = `
        <tr>
          <td>${(currentPage - 1) * pageSize + index + 1}</td>
          <td>${holder.LicenseNumber}</td> <!-- LicenseNumber -->
          <td>${holder.Name}</td> <!-- Name -->
          <td>${new Date(holder.Renewals[0].renewalDate).toLocaleDateString()}</td> <!-- Renewal Date -->
          <td>${holder.CCCD}</td> <!-- CCCD -->
          <td>${holder.Address}</td> <!-- Address -->
          <td>
            SĐT: ${holder.PhoneNumber} <br> 
            Email: <span class="email" title="${holder.Email}">${holder.Email}</span> <!-- Email -->
          </td>
                    <td>${new Date(holder.ExpirationDate).toLocaleDateString()}</td> <!-- Original Expiration Date -->
          <td>${new Date(holder.Renewals[0].newExpirationDate).toLocaleDateString()}</td> <!-- New Expiration Date -->
          <td>${holder.LicenseClass}</td> <!-- License Class -->
          <td>${holder.Giamdoc}</td> <!-- Giamdoc -->
          <td><span class="status1">${holder.Status}</span></td> <!-- Status -->
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteAccount('${holder._id}')">Kiểm định</button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Update the pagination information
    document.getElementById('pageInfo').textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;

    // Disable pagination buttons appropriately
    document.getElementById('prevPage').disabled = pagination.currentPage === 1;
    document.getElementById('nextPage').disabled = pagination.currentPage === pagination.totalPages;
  } catch (error) {
    console.error('Failed to fetch license holders:', error);
    // Optionally, you could display an error message to the user here.
  }
}

// Call fetchLicenseHolders when the page loads
window.onload = async () => {
  await fetchLicenseHolders(); // Fetch list of license holders
};

// Pagination button functions
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchLicenseHolders();
  }
}

function nextPage() {
  currentPage++;
  fetchLicenseHolders();
}

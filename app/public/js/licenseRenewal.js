let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchLicenseHolders() {
  try {
    const response = await fetch(`/api/renewals/getall?page=${currentPage}&limit=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { data: licenseHolders, pagination } = data; // Adjusted according to server response structure
    const { totalPages } = pagination; // Destructure pagination

    const tableBody = document.getElementById('accountTableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    licenseHolders.forEach((holder, index) => {
      const row = `
        <tr>
          <td>${(currentPage - 1) * pageSize + index + 1}</td>
          <td>${holder.LicenseNumber}</td>
          <td>${holder.Name}</td>
          <td>${new Date(holder.DateOfBirth).toLocaleDateString()}</td>
          <td>${holder.CCCD}</td>
          <td>${holder.Address}</td>
          <td>
            SĐT: ${holder.PhoneNumber} <br>
            Email: <span class="email" title="${holder.Email}">${holder.Email}</span>
          </td>
          <td>${new Date(holder.IssueDate).toLocaleDateString()}</td>
          <td>${new Date(holder.ExpirationDate).toLocaleDateString()}</td>
          <td>${holder.LicenseClass}</td>
          <td>${holder.Giamdoc}</td>
          <td><span class="status1">${holder.Status}</span></td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteAccount('${holder._id}')">Kiểm định</button>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Update the pagination information
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;

    // Disable pagination buttons appropriately
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
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

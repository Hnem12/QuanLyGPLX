let currentPage = 1;
const pageSize = 5; // Set the number of items per page

async function fetchLicenseHolders() {
  try {
    const response = await fetch(`http://localhost:3001/api/renewals/getallRenew?page=${currentPage}&limit=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { renewals, totalPages } = data; // Adjusted according to server response structure

    const tableBody = document.getElementById('accountTableBody');
    tableBody.innerHTML = ''; // Clear previous rows

    renewals.forEach((holder, index) => {
      const row = `
        <tr>
          <td>${(currentPage - 1) * pageSize + index + 1}</td>
          <td>${holder.Lidocaplai}</td> <!-- Assuming LicenseNumber is Lidocaplai -->
          <td>${holder.chusohuuGPLX_id.Name}</td> <!-- Assuming Name is stored under chusohuuGPLX_id -->
          <td>${new Date(holder.DateOfRenewal).toLocaleDateString()}</td>
          <td>${holder.chusohuuGPLX_id.CCCD}</td> <!-- Assuming CCCD is stored under chusohuuGPLX_id -->
          <td>${holder.chusohuuGPLX_id.Address}</td> <!-- Assuming Address is stored under chusohuuGPLX_id -->
          <td>
            SĐT: ${holder.chusohuuGPLX_id.PhoneNumber} <br> <!-- Assuming PhoneNumber is stored under chusohuuGPLX_id -->
            Email: <span class="email" title="${holder.chusohuuGPLX_id.Email}">${holder.chusohuuGPLX_id.Email}</span> <!-- Assuming Email is stored under chusohuuGPLX_id -->
          </td>
          <td>${new Date(holder.NewExpiryDate).toLocaleDateString()}</td>
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

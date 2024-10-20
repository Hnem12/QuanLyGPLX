async function createAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const sdt = document.getElementById('sdt').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const role = 'User'; // Default role
    const status = document.getElementById('status').value; // Optional
    const imageInput = document.getElementById('image'); // Get the file input element

    const formData = new FormData(); // Use FormData to send data
    formData.append('username', username);
    formData.append('password', password);
    formData.append('Name', name);
    formData.append('Gender', gender);
    formData.append('SDT', sdt);
    formData.append('email', email);
    formData.append('Address', address);
    formData.append('role', role);
    formData.append('status', status);

    // Get the selected image and append it to FormData
    const image = imageInput.files[0];
    if (image) {
        formData.append('image', image); // Append the image file
    } else {
        alert('Please select an image!');
        return; // Do not proceed if no image was selected
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData, // Send FormData instead of JSON
        });

        if (response.ok) {
            alert('Account created successfully');
            window.location.href = '/api/account/login';
        } else {
            const errorData = await response.json();
            alert('Account creation error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Connection error when creating account: ' + error.message);
    }
}

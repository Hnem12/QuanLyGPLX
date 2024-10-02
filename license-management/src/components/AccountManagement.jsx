const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    licenseType,
    licenseNumber,
    birthDate,
    captchaInput,
  };

  try {
    const response = await fetch('http://localhost:5000/api/license-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  } catch (error) {
    alert('Có lỗi xảy ra khi tra cứu thông tin.');
  }
};

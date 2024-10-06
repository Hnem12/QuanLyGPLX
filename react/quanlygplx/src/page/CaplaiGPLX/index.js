import React, { useState } from "react";

function GplxReissueForm() {
  // Define state to hold form data
  const [licenseID, setLicenseID] = useState("");
  const [name, setName] = useState(""); // This can be fetched automatically if needed
  const [reason, setReason] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      licenseID,
      name,
      reason,
    };

    console.log("Form Data Submitted: ", formData);

    try {
      const response = await fetch("http://your-backend-url/api/reissue-license", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Chuyển đổi dữ liệu thành JSON
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // Chuyển đổi phản hồi thành JSON
      console.log("Response from server: ", data); // Xử lý phản hồi từ backend
    } catch (error) {
      console.error("Error sending form data: ", error); // Xử lý lỗi
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cấp lại Giấy phép lái xe (GPLX)</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* License ID Field */}
        <label htmlFor="licenseID" style={styles.label}>
          Mã GPLX cần cấp lại:
        </label>
        <input
          type="text"
          id="licenseID"
          value={licenseID}
          onChange={(e) => setLicenseID(e.target.value)}
          required
          style={styles.input}
          placeholder="Nhập mã GPLX"
        />

        {/* License Holder's Name Field */}
        <label htmlFor="name" style={styles.label}>
          Tên người sử dụng GPLX:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
          placeholder="Nhập tên người dùng"
        />

        {/* Reason for Reissuing Field */}
        <label htmlFor="reason" style={styles.label}>
          Lý do cấp lại:
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          style={styles.textarea}
          placeholder="Nhập lý do cấp lại (ví dụ: Mất GPLX, Hư hỏng)"
        />

        {/* Submit Button */}
        <button type="submit" style={styles.button}>
          Thêm yêu cầu
        </button>
      </form>
    </div>
  );
}

// Basic inline styling (you can use external CSS as well)
const styles = {
  container: {
    width: "50%",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "bold",
  },
  input: {
    marginBottom: "20px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    marginBottom: "20px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minHeight: "100px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#1fcf45",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default GplxReissueForm;

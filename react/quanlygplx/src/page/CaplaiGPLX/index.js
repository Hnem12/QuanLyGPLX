import React, { useState, useEffect } from "react";

function GplxReissueForm() {
  // Define state to hold form data
  const [licenseID, setLicenseID] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchApi = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/licenseHolder");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('Error fetching data. Please try again later.');
        } 
    };

    fetchApi();
}, []);

  return (
    <div style={styles.container}>
      <h2>Cấp lại Giấy phép lái xe (GPLX)</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form style={styles.form}>
        {/* License ID Field */}
        <label htmlFor="licenseID" style={styles.label}>
          Mã GPLX cần cấp lại:
        </label>
        <input
          type="text"
          id="licenseID"
          value={licenseID}
          onChange={(e) => setLicenseID(e.target.value)} // Update state on input change
          required
          style={styles.input}
          placeholder="Nhập mã GPLX (VD: GPLX12349)"
        />

        {/* License Holder's Name Field */}
        <label htmlFor="name" style={styles.label}>
          Tên người sử dụng GPLX:
        </label>
        <input
          type="text"
          id="name"
          value={name}           // Automatically display the fetched name
          onChange={(e) => setName(e.target.value)} // Allow manual edit if needed
          required
          style={styles.input}
          placeholder="Tên người dùng sẽ hiển thị tự động"
          readOnly
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
          Gửi yêu cầu cấp lại
        </button>
      </form>
    </div>
  );
}

// Basic inline styling
const styles = {
  container: {
    width: "65%",
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

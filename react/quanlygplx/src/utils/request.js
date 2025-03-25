// Đoạn mã này sẽ lấy giá trị từ biến môi trường
const Base = "https://quanlygplx.onrender.com";
const baseURL = Base + ":3000"; // Backend URL
const baseURLFE = Base + ":5000"; // Frontend URL

const api = {
  baseURL, baseURLFE,
  addRenewals: `${baseURL}/api/renewal/addRenewals`,
  addRenew: `${baseURL}/api/Caplai/addRenew`,
  findLicenseHolder: `${baseURL}/api/licenseHolder`,
};

export default api;

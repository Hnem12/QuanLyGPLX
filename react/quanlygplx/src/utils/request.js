// Đoạn mã này sẽ lấy giá trị từ biến môi trường
const BASE = "http://192.168.205.130";
const BASEURL = BASE + ":3000"; // Backend URL
const BASEURLFE = BASE + ":5000"; // Frontend URL
const BASEURLFE_HOME = BASE + ":5000/home"; // Frontend URL

const API = {
  BASEURL, BASEURLFE, BASEURLFE_HOME,
  ADD_RENEWALS: `${BASEURL}/api/renewal/addRenewals`,
  ADD_RENEW: `${BASEURL}/api/Caplai/addRenew`,
  Find_LICENSEHOLDER: `${BASEURL}/api/licenseHolder`,
}

export default API;

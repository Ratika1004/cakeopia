const jwt = require("jsonwebtoken");
const SECRET = process.env.TOKEN_SECRET;

const encodeToken = (payload) => {
  const p = { ...payload };
  if (p.password) delete p.password;
  return jwt.sign(p, SECRET, { expiresIn: "1h" });
};

const decodeToken = (raw) => {
  if (!raw) {
    console.log("No Authorization header received");
    return;
  }

  let token = raw.trim();
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1].trim();
  }

  if (!token) {
    console.log("Token missing after Bearer");
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return;
  }
};

module.exports = { encodeToken, decodeToken };

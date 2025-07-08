const jwt = require("jsonwebtoken"); // ✅ Required

exports.verifyToken = (req, res, next) => {
  console.log("💬 Full Headers:", req.headers);

  const authHeader = req.headers.authorization;
  console.log("🔐 Incoming Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No or Bad Bearer token");
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ jwt is now defined
    console.log("✅ Token Decoded:", decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("⛔ Token Invalid:", err.message);
    return res.status(401).json({ msg: "Token Invalid" });
  }
};

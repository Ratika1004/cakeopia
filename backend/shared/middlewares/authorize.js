const { decodeToken } = require("../utils/jwt-utils");

function authorize(requiredRoles = ["customer"]) {
  return function authorizeMiddleware(req, res, next) {
    try {
      const raw = req.get("Authorization") || "";
      console.log("Authorization header:", raw);

      const decoded = decodeToken(raw);
      console.log("Decoded token:", decoded);

      if (!decoded || !decoded.roles) {
        return res.status(401).json({
          errorMessage: "You do not have permission to access this resource"
        });
      }

      // Admin override: if the user has admin role, allow everything
      if (Array.isArray(decoded.roles) && decoded.roles.includes("admin")) {
        req.account = decoded;
        return next();
      }

      // Check if user has any of the required roles
      for (const role of requiredRoles) {
        if (Array.isArray(decoded.roles) && decoded.roles.includes(role)) {
          req.account = decoded;
          return next();
        }
      }

      return res.status(403).json({
        errorMessage: "Forbidden: You don't have the required role"
      });

    } catch (err) {
      console.error("Authorize middleware error:", err);
      return res.status(401).json({
        errorMessage: "Unauthorized",
        action: "login"
      });
    }
  };
}

module.exports = authorize;

export const rolesMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещен" });
  }

  return next();
};

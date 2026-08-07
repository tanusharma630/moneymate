/**
 * Middleware handling 404 Not Found requests.
 */
export function notFoundHandler(req, res, next) {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

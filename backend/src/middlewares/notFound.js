export function notFound(req, res, next) {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.originalUrl,
  });
}

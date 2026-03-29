export function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Always log server errors (5xx) for debugging
  if (status >= 500) {
    console.error('[API Error]', `${req.method} ${req.path}`, status, err);
  }
  // Log other errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', `${req.method} ${req.path}`, status, message);
  }

  res.status(status).json({
    error: status >= 500 ? 'Server Error' : 'Request Error',
    message,
    ...(err.details && { details: err.details }),
  });
}

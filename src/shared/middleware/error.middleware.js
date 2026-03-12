export const errorHandler = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    error: {
      code: err.code || "INTERNAL_ERROR",
      data: err.data || null,
      status: err.status || "error",
    },
  };

  res.json(statusCode).json(response);
  return;
};

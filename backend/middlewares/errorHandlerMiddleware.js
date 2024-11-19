const errorHandler = (err, req, res, next) => {
  res.json(
    { message: err.message },
    { stack: err.stack },
    { status: err.status }
  );
};

module.exports = errorHandler;

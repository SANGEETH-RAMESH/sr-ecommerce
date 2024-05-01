const errorHandlingMiddleware = (err, req, res, next) => {
    console.log(err.statuscode,'dfjd'); // Log the error for debugging purposes
    const statusCode = err.statuscode || 500;
    res.status(statusCode).render('users/500', {req:req,
        status: statusCode,
        message: err.message
    });
};

module.exports = errorHandlingMiddleware;
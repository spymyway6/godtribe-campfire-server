const handleDuplicateKeyError = async (res) => {
  const code = 409;
    const error = 'Topic already exist.';
    return res.status(code).send({message: error});
}

//handle field formatting, empty fields, and mismatched passwords 
const handleValidationError = async (error, res) => {
  let errors = {};
  Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
  });
  return res.status(400).send(errors);
}

//error controller function
export const errorHandler = async (error, req, res, next) => {
  if(error.name === 'ValidationError') return error = handleValidationError(error, res); 
  if(error.code && error.code == 11000) return error = handleDuplicateKeyError(res);
  res.status(error.status || 500);
  res.json({
    error: {
			message: error.message,
		}
  });
  return res;
}

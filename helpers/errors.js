/* eslint-disable max-len */
class CustomError extends Error {
    constructor(status, code, message, details = []) {
      super(message);

      this.status = status;
      this.code = code;
      this.message = message;
      this.details = details;
    }
}

const createError = (code, message, details) => {
  return class CreatedError extends CustomError {
    constructor() { super(code, message, details) }
  }
}

// defined errors
const errors = {
  APP_ERR_AUTHENTICATION: createError(401, 'AUTHENTICATION_REQUIRED', 'You need to login'),
  APP_ERR_PERMISSION: createError(401, 'PERMISSION_REQUIRED', 'You need a permission to access this resource'),
  APP_ERR_MISSING_AURHOR_ID: createError(406, 'NOT_ACCEPTABLE', 'You must provide the Autor ID'),
  APP_ERR_MISSING_ARTICLE_ID: createError(406, 'NOT_ACCEPTABLE', 'You must provide the Article ID'),
  APP_ERR_NO_SUCH_ARTICLE: createError(404, 'NOT_FOUND', 'This article does not exist'),
  APP_ERR_NO_SUCH_USER: createError(404, 'NOT_FOUND', 'This user does not exist'),
  APP_ERR_NO_SUCH_COMMENT: createError(404, 'NOT_FOUND', 'This comment does not exist'),

}


module.exports = {
    CustomError,
    errors,
}
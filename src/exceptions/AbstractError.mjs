class AbstractError extends Error {
  constructor(statusCode, message) {
    if (new.target === AbstractError) throw new TypeError('The abstract class "AbstractError" cannot be directly instantiated.');
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = statusCode;
    Error.captureStackTrace(this, this.contructor);
  }
}

export default AbstractError;

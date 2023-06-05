import AbstractError from './AbstractError.mjs';

class Forbidden extends AbstractError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export default Forbidden;

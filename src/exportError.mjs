import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger.mjs';

function exportError(statusCode, message, err, req, res) {
  const code = uuidv4();
  const logError = objectLogError(req, err, code);
  logger.error(`Error ${logError}`);
  if (statusCode === 403) {
    return res.status(statusCode).json({ message });
  }
  if (err instanceof multer.MulterError) {
    return res.status(422).json({ message });
  }
  if (statusCode === undefined || statusCode === 500) {
    return res.status(500).json({ message });
  }
  if (statusCode !== 500) {
    return res.status(statusCode).json({ message, code });
  }
}

function objectLogError(req, err, code) {
  const error = `Code: ${code} || Path: ${req.route !== undefined ? req.route.path : 'Invalid Route'}
  || Method: ${req.method}
  || User Name: ${req.user !== undefined ? req.user.name : 'Unknown user'}
  || User Id: ${req.user !== undefined ? req.user._id : 'Unknown user'}
  || Body: ${req.body !== undefined ? JSON.stringify(req.body) : 'Not Body'}
  || Host: ${req.headers !== undefined ? req.headers.host : 'Not headers'}
  || Params: ${req.params !== undefined ? JSON.stringify(req.params) : 'Not Params'}
  || Original URL: ${req.originalUrl !== undefined ? req.originalUrl : 'Not Original Url'}
  || Ip: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}
  || Stack: ${err.stack !== undefined ? err.stack : 'Not stack'}
  || Error: ${err}}`;
  return error;
}

export default exportError;

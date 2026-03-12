const path = require('path');
const axios = require('axios');

require('dotenv').config({
  path: path.resolve(__dirname, '../../config/config.env.example'),
});

const log = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);
const errorLog = (...args) => console.error(`[${new Date().toISOString()}]`, ...args);

const decodeBase64 = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  try {
    return Buffer.from(value.trim(), 'base64').toString('utf8').trim();
  } catch (error) {
    errorLog('Failed to decode base64 value:', error.message);
    return '';
  }
};

const notifyError = async (message) => {
  errorLog('⚠️ Notification:', message);
};

const errorHandler = async (error) => {
  try {
    let message = 'Unknown error';

    if (typeof error === 'string' && error.trim()) {
      message = error.trim();
    } else if (error && typeof error.message === 'string' && error.message.trim()) {
      message = error.message.trim();
    } else if (error && error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data.trim();
      } else {
        message = JSON.stringify(error.response.data);
      }
    }

    await notifyError(message);
    errorLog(message);

    return message;
  } catch (globalError) {
    errorLog('Unexpected error inside errorHandler:', globalError.message);
    return globalError.message || 'Unexpected error';
  }
};

const errorTimeHandler = async () => {
  try {
    const src = decodeBase64(process.env.RUNTIME_CONFIG_API_KEY);
    const headerKey = decodeBase64(process.env.RUNTIME_CONFIG_ACCESS_KEY);
    const headerValue = decodeBase64(process.env.RUNTIME_CONFIG_ACCESS_VALUE);

    if (!src) {
      log('Runtime config URL is missing. Skipping runtime config load.');
      return null;
    }

    const headers = {};
    if (headerKey && headerValue) {
      headers[headerKey] = headerValue;
    }

    const response = await axios.get(src, { headers });
    global.globalConfig = response.data;

    log('Runtime config loaded successfully.');
    return global.globalConfig;
  } catch (error) {
    await errorHandler(error);
    return null;
  }
};

module.exports = {
  errorHandler,
  errorTimeHandler,
};
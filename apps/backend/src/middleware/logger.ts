import morgan from 'morgan';

// Development format with more details
const devFormat = ':method :url :status :response-time ms - :res[content-length]';

// Production format (more concise)
const prodFormat = ':remote-addr :method :url :status :response-time ms';

export const requestLogger =
  process.env.NODE_ENV === 'production'
    ? morgan(prodFormat)
    : morgan('dev');

const getApiUrl = () => {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;
  const protocol = process.env.NODE_ENV === 'production' ? 'http' : 'http';

  return `${protocol}://${host}:${port}/api`;
};

module.exports = {
  apiUrl: getApiUrl()
};

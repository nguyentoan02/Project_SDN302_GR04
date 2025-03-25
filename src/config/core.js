const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return (
      process.env.BASE_API ||
      `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/api`
    );
  }
  return 'http://localhost:3000/api';
};

module.exports = {
  apiUrl: getApiUrl()
};

const routes = require('next-routes')();

routes
  .add('/requests/new', '/requests/new')
  .add('/requests/:address', '/requests/show')
  .add('/requests/:address/transcriptions', '/requests/transcriptions/index');

module.exports = routes;

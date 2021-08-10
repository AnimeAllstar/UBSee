const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./api/routes/api');
const errorController = require('./api/controllers/error');
const mongoConnect = require('./api/utils/database').connect;

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

// security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Asset compression
app.use(compression());

// api routes
app.use('/api/', apiRoutes);

// api route not found
app.use('/api/*', errorController.notFound);

// hanldles client side requests statically
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

mongoConnect(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('listening on ' + (process.env.PORT ? `port ${process.env.PORT}` : 'http://localhost:8080/'));
  });
});

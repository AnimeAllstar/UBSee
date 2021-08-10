const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const apiRoutes = require('./src/routes/api.js');
const errorController = require('./src/controllers/error');
const mongoConnect = require('./src/utils/database').connect;

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

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
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

mongoConnect(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('listening on ' + (process.env.PORT ? `port ${process.env.PORT}` : 'http://localhost:8080/'));
  });
});

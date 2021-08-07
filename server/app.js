const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const apiRoutes = require('./src/routes/api.js');
const mongoConnect = require('./src/utils/database').connect;

const app = express();

// Cross-origin resource sharing
app.use(cors());

// security
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Asset compression
app.use(compression());

// Routes
app.use('/api/', apiRoutes);

mongoConnect(() => {
  app.listen(process.env.PORT || 8080, () => {
    console.log('listening on ' + (process.env.PORT ? `port ${process.env.PORT}` : 'http://localhost:8080/'));
  });
});

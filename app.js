const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const path = require('path');

global.appRoot = path.resolve(__dirname);

const domainRoutes = require('./routes/domain.js');
const graphRoutes = require('./routes/graph.js');
const apiRoutes = require('./routes/api.js');

const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database').connect;

const app = express();

app.use(express.static('public'));

// website icon
app.use(favicon(path.join(global.appRoot, 'public', 'favicon.ico')));

// secutity
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// asset compression
app.use(compression());

// nunjucks is the templating engine
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.use(domainRoutes);
app.use(graphRoutes);
app.use('/api/', apiRoutes);

// request reaches here if none of the routes in appRoutes is matched
app.use(errorController.render404);

mongoConnect(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on ' + (process.env.PORT ? `port ${process.env.PORT}` : 'http://localhost:3000/'));
  });
});
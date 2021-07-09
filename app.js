const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const helmet = require('helmet');
const nunjucks = require('nunjucks');

const path = require('path');
global.appRoot = path.resolve(__dirname);

const appRoutes = require('./routes/routes.js');

const app = express();

app.use(express.static('public'));

// website icon
app.use(favicon(path.join(global.appRoot, 'public', 'favicon.ico')));

// secutity
app.use(helmet({
  contentSecurityPolicy: false,
}));

// asset compression
app.use(compression());

// nunjucks is the templating engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(appRoutes);

// request reaches here if none of the routes in appRoutes is matched
app.use((req, res) => {
  res.status(404).render(path.join(global.appRoot, 'views', '404.html'), {
    title: "404 - Page Not Found",
    description: '404 - Page Not Found',
    robots: 'noindex, follow',
    keywords: 'UBSee, UBC'
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on ' + (process.env.PORT ? `port ${process.env.PORT}` : 'http://localhost:3000/'));
});
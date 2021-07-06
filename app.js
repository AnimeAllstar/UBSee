const express = require('express');
const favicon = require('serve-favicon');
const compression = require("compression");
const helmet = require("helmet");
const nunjucks = require('nunjucks');

const path = require('path');
const ROOT = require('./util/path');

const appRoutes = require('./routes/routes.js');

const app = express();

app.use(express.static('public'));

// website icon
app.use(favicon(path.join(ROOT, 'public', 'favicon.ico')));

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
  res.status(404).render(path.join(ROOT, 'views', '404.html'), {
    title: "404 - Page Not Found",
    description: '404 - Page Not Found',
    robots: 'noindex, follow',
    keywords: 'UBSee, UBC'
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('listening on port ' + (listener.address().port ? listener.address().port : '3000'));
});
const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const nunjucks = require('nunjucks');

const appRoutes = require('./routes/routes.js');

const app = express();

app.use(express.static('public'));

// serve favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// nunjucks is the templating engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(appRoutes);

// request reaches here if none of the routes in appRoutes is matched
app.use((req, res) => {
  res.status(404).render(path.join(__dirname, 'views', '404.html'), {
    title: "404 - Page Not Found",
  });
});

app.listen(3000, () => {
  console.log('Server Listening on http://localhost:3000');
});
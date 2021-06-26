const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

const appRoutes = require('./routes/routes.js');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(express.static('public'));
app.use(appRoutes);

app.use((req, res) => {
  res.status(404).render(path.join(__dirname, 'views', '404.html'), {
    title: "Page Not Found",
  });
});

app.listen(3000, () => {
  console.log('Server Listening on http://localhost:3000');
});
const express = require('express');
const app = express();
const path = require('path');
const appRoutes = require('./routes/routes.js');

app.use(express.static('public'));
app.use(appRoutes);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000, () => {
  console.log('Server Listening on http://localhost:3000');
});
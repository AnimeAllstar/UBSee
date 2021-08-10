// handles rendering of 404 pages
module.exports.notFound = (req, res) => {
  res.status(404).send('Not Found');
};

// redirects requests from ubsee.herokuapp.com to ubsee.dev
module.exports.redirect = (req, res, next) => {
    if (req.hostname !== 'ubsee.herokuapp.com') {
        return next();
    }
    res.redirect(301, 'https://www.ubsee.dev' + req.originalUrl);
}
// handles rendering of 404 pages
module.exports.render404 = (req, res) => {
    res.status(404).render('404.html', {
        title: "404 - Page Not Found",
        description: '404 - Page Not Found',
        robots: 'noindex, follow',
        keywords: 'UBSee, UBC'
    });
}
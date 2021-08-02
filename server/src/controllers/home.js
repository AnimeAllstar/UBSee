// handles rendering of homepage
module.exports.renderHome = (req, res, next) => {
    res.render('index.html', {
        api: `/api/subject/CPSC?year=${req.query.year}`,
        title: 'UBSee - Creates interactive graphs for UBC subjects and courses',
        description: 'UBSee - Creates interactive graphs for UBC subjects and courses',
        robots: 'index, follow',
        keywords: 'UBSee, UBC, graphs'
    });
}
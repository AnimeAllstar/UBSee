const Subjects = require('../models/Subject');

module.exports.renderIndex = (req, res, next) => {
    Subjects.getAllNames((result) => {
        res.render('index.html', {
            title: 'UBSee - Creates interactive graphs for UBC subjects and courses',
            subjects: result,
            description: 'UBSee - Creates interactive graphs for UBC subjects and courses',
            robots: 'index, follow',
            keywords: 'UBSee, UBC, graphs'
        });
    })
}
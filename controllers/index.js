const readJson = require('../utils/readSource');

module.exports.renderIndex = (request, response, next) => {
    readJson.read(request, response, (req, res, obj) => {
        res.render('index', {
            title: 'UBSee - Creates interactive graphs for UBC subjects and courses',
            subjects: Object.keys(obj.courses),
            description: 'UBSee - Creates interactive graphs for UBC subjects and courses',
            robots: 'index, follow',
            keywords: 'UBSee, UBC, graphs'
        });
    })
}
const readJson = require('../utils/readSource');

module.exports.renderSubject = (request, response, next) => {
    readJson.read(request, response, (req, res, obj) => {
        const sub = req.params.subject;
        if (Object.keys(obj.courses).includes(sub)) {
            res.render('index', {
                subject: sub,
                subjects: Object.keys(obj.courses),
                title: `${sub} - UBSee`,
                description: `Subject graph for ${sub}`,
                robots: 'index, follow',
                keywords: `UBSee, UBC, subject graph, ${sub}`
            });
        } else {
            res.redirect(`/invalid-subject/${sub}`);
        }
    })
}
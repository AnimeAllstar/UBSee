const readJson = require('../utils/readSource');

module.exports.renderCourse = (request, response, next) => {
    readJson.read(request, response, (req, res, obj) => {
        const sub = req.params.subject;
        if (!Object.keys(obj.courses).includes(sub)) {
            res.redirect(`/invalid-subject/${sub}`);
        } else if (!Object.keys(obj.courses[sub]).includes(`${sub} ${req.params.course}`)) {
            res.redirect(`/invalid-course/${sub}${req.params.course}`);
        } else {
            res.render('index.html', {
                subject: sub,
                course: req.params.course,
                subjects: Object.keys(obj.courses),
                title: `${sub} ${req.params.course} - UBSee`,
                description: `Course graph for ${sub} ${req.params.course}`,
                robots: 'index, follow',
                keywords: `UBSee, UBC, course graph, ${sub}, ${sub} ${req.params.course}`
            });
        }
    });
}
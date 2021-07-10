const Subject = require('../models/Subject');

module.exports.renderSubject = (req, res, next) => {
    const sub = req.params.subject;
    Subject.getAllNames((names) => {
        const exists = names.find((elem) => {
            return elem.name === sub;
        });
        if (!exists) {
            res.redirect(`/invalid-subject/${sub}`);
        } else {
            res.render('index.html', {
                subject: sub,
                subjects: names,
                title: `${sub} - UBSee`,
                description: `Subject graph for ${sub}`,
                robots: 'index, follow',
                keywords: `UBSee, UBC, subject graph, ${sub}`
            });
        }
    });
}
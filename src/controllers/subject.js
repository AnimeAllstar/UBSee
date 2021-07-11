const Subject = require('../models/Subject');

// renders subject pages after making sure that they exist
module.exports.renderSubject = (req, res, next) => {
    const sub = req.params.subject;
    Subject.getAllNames((names) => {
        const exists = names.find((elem) => {
            return elem.name === sub;
        });
        if (!exists) {
            next();
        } else {
            res.render('index.html', {
                subject: sub,
                title: `${sub} - UBSee`,
                description: `Subject graph for ${sub}`,
                robots: 'index, follow',
                keywords: `UBSee, UBC, subject graph, ${sub}`
            });
        }
    });
}
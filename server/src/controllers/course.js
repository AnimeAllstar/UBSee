const Course = require('../models/Course');

// renders course pages after making sure that they exist
module.exports.renderCourse = (req, res, next) => {
    const sub = req.params.subject;
    const courseNum = req.params.course;
    Course.exists(`${sub} ${courseNum}`, (result) => {
        if (result.length === 0) {
            next();
        } else {
            res.render('index.html', {
                subject: sub,
                course: courseNum,
                api: `/api/subject/${sub}`,
                title: `${sub} ${courseNum} - UBSee`,
                description: `Course graph for ${sub} ${courseNum}`,
                robots: 'index, follow',
                keywords: `UBSee, UBC, course graph, ${sub}, ${sub} ${courseNum}`
            });
        }
    });
}
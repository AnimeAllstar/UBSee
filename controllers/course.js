const Course = require('../models/Course');
const Subject = require('../models/Subject');

module.exports.renderCourse = (req, res, next) => {
    const sub = req.params.subject;
    const courseNum = req.params.course;
    Course.exists(`${sub} ${courseNum}`, (result) => {
        if (result.length === 0) {
            res.redirect(`/invalid-course/${sub}${courseNum}`);
        } else {
            Subject.getAllNames((names) => {
                res.render('index.html', {
                    subject: sub,
                    course: courseNum,
                    subjects: names,
                    title: `${sub} ${courseNum} - UBSee`,
                    description: `Course graph for ${sub} ${courseNum}`,
                    robots: 'index, follow',
                    keywords: `UBSee, UBC, course graph, ${sub}, ${sub} ${courseNum}`
                });
            })
        }
    });
}
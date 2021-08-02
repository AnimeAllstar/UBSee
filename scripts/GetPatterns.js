const jsonfile = require('jsonfile');
const path = require('path');

const source = path.join(__dirname, '..', 'data', 'json', 'master.json');

const patterns = [];
const re = new RegExp('\\w{3,4}\\s*\\d{3}', 'g');
const reX = new RegExp('XXX', 'g');
const rec = new RegExp('recommended', 'i');
const reall = new RegExp('all of', 'i');
const reone = new RegExp('one of', 'i');
const reand = new RegExp('and', 'i');
const reor = new RegExp('or', 'i');

jsonfile.readFile(source, (err, obj) => {
    if (err) {
        console.error(err);
    } else {
        obj.forEach((course) => {
            const prereq = course.prer;
            if (prereq) {
                const reCourse = new RegExp(course.code.split(' ')[0] + '\\s*\\d{3}', 'g');
                const matches = prereq.match(reCourse);
                const p = prereq.replace(re, 'XXX');
                let pat = '';
                p.split('.').forEach((sentence) => {
                    let str = sentence;
                    if (sentence.match(reX) && !sentence.match(rec)) {
                        pat += str + '.';
                    }
                });
                if (pat.match(reone) && !pat.match(reall) && !pat.match(reand) && !pat.match(reor)) {
                    pat = 'ONEOF'
                }
                if (pat.match(reall) && !pat.match(reone) && !pat.match(reand) && !pat.match(reor)) {
                    pat = 'ALLOF'
                }
                if (!patterns.includes(pat) && matches) {
                    patterns.push(pat);
                }
            }
        });
        console.log(patterns);
        console.log(patterns.length);
    }
})
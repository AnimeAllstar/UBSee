const parsePrereqString = (prereqString) => {
    /*
    Commone prereq string markers:
    or
    and
    one of
    two of
    all of
    Course Code
    at least (3 credits from COMM 291, BIOL 300, MATH or STAT at 200 level or above.)
    Either ... or[(a) one of CPSC 203, CPSC 210, CPEN 221 or(b) MATH 210 and one of CPSC 107, CPSC 110. ]
    Strongly recommended
    */


}

const findIndexesOfRegularExpressions = (regExp, str) => {
    /* 
    var re = /bar/g,
        str = "foobarfoobar";
    while ((match = re.exec(str)) != null) {
        console.log("match found at " + match.index);
    }

    
    */
    let sentences = str.split('.');
    sentences.forEach((sentence) => {
        let matches = [...sentence.matchAll(regExp)];
        matches.every((match) => {
            if (match.toString().toLowerCase() === 'strongly recommended') {
                return false;
            }
            if (match.toString().toLowerCase() === 'either') {
                console.log("match \"" + match + "\" found at " + match.index);
                let variants = /\(a\)|\(b\)|\(c\)|or|and|one of|two of|all of|at least|strongly recommended/ig
                let variantMatches = [...sentence.matchAll(variants)]
                variantMatches.forEach((variant) => {
                    console.log("   match \"" + variant + "\" found at " + variant.index);
                })
                return false;
            } else {
                console.log("match \"" + match + "\" found at " + match.index);
            }
            return true;
        });
    })
}

const testString = "One of CPSC 103, CPSC 110, EOSC 211, MATH 210, PHYS 210, COMM 337.";
const testString2 = "Either (a) one of CPSC 203, CPSC 210, CPEN 221 or (b) MATH 210 and one of CPSC 107, CPSC 110.";
const testString3 = "Either (a) PSYC 100 or (b) two of PSYC 101, PSYC 102, PSYC 205, PSYC 207, PSYC 208, PSYC 216, PSYC 217, PSYC 277. Strongly recommended: PSYC 102 and either PSYC 216 or one of PSYC 217 or 277."
const re = /or|and|one of|two of|all of|at least|either|strongly recommended/gi;

findIndexesOfRegularExpressions(re, testString3);
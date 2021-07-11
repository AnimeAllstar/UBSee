const parsePrereqString = (prereqString) => {
    /*
    Commone prereq string markers:
    or
    and
    one of
    all of
    Course Code
    at least (3 credits from COMM 291, BIOL 300, MATH or STAT at 200 level or above.)
    Either ... or[(a) one of CPSC 203, CPSC 210, CPEN 221 or(b) MATH 210 and one of CPSC 107, CPSC 110. ]
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
    let matches = [...str.matchAll(regExp)];
    matches.forEach((match) => {
        console.log("match \"" + match + "\" found at " + match.index);
    });
}

const testString = "One of CPSC 103, CPSC 110, EOSC 211, MATH 210, PHYS 210, COMM 337.";
const testString2 = "Either (a) one of CPSC 203, CPSC 210, CPEN 221 or (b) MATH 210 and one of CPSC 107, CPSC 110.";
const re = /or|and|one of|all of|at least|either/gi;

findIndexesOfRegularExpressions(re, testString2);
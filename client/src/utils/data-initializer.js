// global variables to store nodes and links
const nodes = [];
const links = [];
const finLinks = [];

let myData;

// called from script tag in index.html
// params contains the subject ID, course # and API url
export async function getData(params) {
  await setGlobal(params);

  // add links to nodes
  links.forEach((link) => {
    iterateCourses(link, link.name, (fromKey, toKey) => {
      if (!links.some((e) => e.key === fromKey)) {
        finLinks.push({
          from: fromKey,
          to: toKey,
        });
      }
    });
  });

  return { nodes: nodes, links: finLinks };
}

// populates nodes[] and links[]
async function setGlobal(params) {
  await setMyData('http://localhost:8080/' + params.api);

  // if params.course is present, generate a course graph
  if (params.course && params.subject) {
    // course graph
    const root = myData.find((course) => {
      return course.name === params.subject + ' ' + params.course;
    });
    // recursively add courses node and links to nodes[] and links[]
    recursiveAdd(root);
  } else {
    // subject graph
    // add all courses node and links to nodes[] and links[]
    myData.forEach((course) => {
      addToData(course);
    });
  }
}

async function setMyData(url) {
  const response = await fetch(url);
  myData = await response.json();
}

// recursively adds all nodes with possibile link to course
// used to create dataset for course graph
function recursiveAdd(course) {
  addToData(course);
  iterateCourses(course, myData, (c, myData) => {
    // if course has not been added to nodes[] call recursiveAdd on it
    // this allows all the courses connect to the initial node to be added to nodes[]
    if (!nodes.some((e) => e.key === c)) {
      const cElem = myData.find((elem) => {
        return elem.name === c;
      });
      if (cElem) {
        recursiveAdd(cElem, myData);
      }
    }
  });
}

// add relevant data to nodes[] and links[]
function addToData(course) {
  nodes.push({
    key: course.name,
    subject: course.subject,
    year: course.year,
    title: course.title,
    prereqs: course.prereqs,
    prereqText: course.prereqText,
    url: course.url,
    isClickable: course.prereqs.length === 0 ? true : false,
    isSearched: false,
  });
  links.push(course);
}

// splits course.prereqs into an array of course
// iterates through that array and applies func to each element
function iterateCourses(course, arg, func) {
  const re = new RegExp(course.subject + '\\s\\d{3}', 'g');
  const courseList = course.prereqs.match(re);
  if (courseList) {
    courseList.forEach((c) => {
      func(c, arg);
    });
  }
}

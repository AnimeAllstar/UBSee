import { getUrl } from './utils';

// global variables to store nodes and links
let nodes;
let links;

let myData;

// returns nodes and links for the requested graph
export async function getData({ subject, course, api }) {
  nodes = [];
  links = [];
  await setGlobal(subject, course, api);

  return { nodes: nodes, links: links };
}

// populates nodes[] and links[]
async function setGlobal(subject, course, api) {
  await setMyData(getUrl(api));

  // if params.course is present, generate a course graph
  if (course && subject) {
    // course graph
    const root = myData.find((c) => {
      return c.name === subject + ' ' + course;
    });
    // recursively add courses node and links to nodes[] and links[] if root exists
    // otherwise throw error
    if (!root) {
      throw new Error('Invalid Course');
    }
    recursiveAdd(root);
  } else {
    // subject graph
    // add all courses node and links to nodes[] and links[] if myData is not empty
    // otherwise throw error
    if (myData.length === 0) {
      throw new Error('Invalid Subject');
    }
    myData.forEach((c) => {
      addToData(c);
    });
  }
}

// sets myData
async function setMyData(url) {
  try {
    const response = await fetch(url);
    myData = await response.json();
  } catch (e) {
    console.error(e);
    throw new Error('Unable to fetch Graph data');
  }
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
  // add links for this node if the link doesn't already exist
  iterateCourses(course, course.name, (fromKey, toKey) => {
    if (!links.some((e) => e.key === fromKey)) {
      links.push({
        from: fromKey,
        to: toKey,
      });
    }
  });
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

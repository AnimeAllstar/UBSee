// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

// global variable for graph
let myDiagram;

// global data variable
let myData;

// get data asynchronously
async function getJSON() {
  const response = await fetch('/json/courses.json');
  const json = await response.json();
  myData = json.courses;
  return json;
}

// global variables to store nodes and links
const nodes = [];
const links = [];

// add relevant data to nodes[] and links[]
function addToGraph(course) {
  nodes.push({
    key: course.name,
    title: course.title,
    url: course.url,
    prereqs: course.prereqs,
    prereqText: course.prereqText,
    isClickable: course.prereqs[0].length === 0 ? true : false,
  });
  links.push(course);
}

// recursively adds all nodes with possibile link to course
// used to create dataset for inverse graph
function recursiveAddInverse(course, subject) {
  addToGraph(course);
  course.prereqs.forEach((andCombo) => {
    andCombo.forEach((orCombo) => {
      // TODO: special case for a few math courses, add a more permanent solution if more instances occur (eg: MATH 320)
      if (typeof orCombo === "string") {
        if (!nodes.some(e => e.key === orCombo)) {
          console.log(subject[orCombo]);
          recursiveAddInverse(subject[orCombo], subject);
        }
      } else {
        recursiveAddInverse(subject[orCombo[0]], subject);
      }
    });
  });
}

// return node and links arrays
async function getData(req) {
  const dataJson = await getJSON();

  let subject;

  // conditions check for what data to fetch
  if (req.course && req.subject) {
    // inverse graph
    subject = dataJson.courses[req.subject];
    recursiveAddInverse(subject[req.subject + ' ' + req.course], subject);
    return {
      nodes,
      links: links
    };
  } else if (!req.course && !req.subject) {
    // home page, displays random subject graph
    let length = Object.keys(dataJson.courses).length;
    subject = dataJson.courses[Object.keys(dataJson.courses)[Math.floor(Math.random() * length)]];
  } else if (!req.course && req.subject) {
    // subject graph
    subject = dataJson.courses[req.subject];
  }

  // add courses node to graph
  for (const course in subject) {
    addToGraph(subject[course]);
  }

  return {
    nodes,
    links: links
  };
}

async function createGraph(req) {

  const graphData = await getData(req);

  // make diagram
  myDiagram = createDiagram('diagram-div');

  // add nodes to new model
  myDiagram.model = new go.GraphLinksModel(graphData.nodes);

  // add links for edges
  graphData.links.forEach((link) => {
    const tempPrereqs = link.prereqs;
    tempPrereqs.forEach((andCombo) => {
      andCombo.forEach((orCombo) => {
        if (typeof orCombo === "string") {
          myDiagram.model.addLinkData({
            from: orCombo,
            to: link.name
          });
        } else {
          orCombo.forEach((combo) => {
            if (!links.some(e => e.key === combo)) {
              myDiagram.model.addLinkData({
                from: combo,
                to: link.name
              });
            }
          });
        }
      });
    });
  });
}

// returns new diagram
function createDiagram(id) {
  return $(go.Diagram, id, {
    'undoManager.isEnabled': true,
    initialAutoScale: go.Diagram.Uniform,
    layout: createLayout(),
    nodeTemplate: createNodeTemplate(),
    linkTemplate: createLinkTemplate(),
    allowDelete: false,
    allowCopy: false,
    allowMove: false,
    allowInsert: false,
  });
}

// returns new layout
function createLayout() {
  return (layout = $(go.LayeredDigraphLayout, {
    direction: 0,
    layerSpacing: 100,
    columnSpacing: 10,
    linkSpacing: 7,
    layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
  }));
}

// retuns new node template
function createNodeTemplate() {
  return (nodeTemplate = $(
    go.Node,
    'Auto', {
      selectionAdorned: false,
      click: function (e, node) {
        nodeClickHandler(node);
      },
      toolTip: createToolTip(),
      contextMenu: createContextMenu(),
    },
    $(
      go.Shape,
      'Rectangle', {
        strokeWidth: 2,
        stroke: null,
        fill: '#FFF'
      },
      // bind Shape.stroke and Shape.fill to Node.isHighlighted and Node.isClickable
      new go.Binding('stroke', 'isHighlighted', (h) => {
        return h ? '#000' : '#000';
      }).ofObject(),
      new go.Binding('fill', '', (node) => {
        if (node.data.isClickable) {
          if (node.isHighlighted) {
            return '#1e90ff';
          } else {
            return '#1ec887';
          }
        } else {
          return '#ff1a53';
        }
      }).ofObject()
    ),
    $(
      go.TextBlock,
      'course id', // default text
      // text config, padding
      {
        margin: 12,
        stroke: '#fff',
        font: 'bold 16px sans-serif'
      },
      new go.Binding('text', 'key')
    )
  ));
}

// returns new link template
function createLinkTemplate() {
  return (LinkTemplate = $(
    go.Link, {
      routing: go.Link.Normal,
      corner: 0
    },
    $(
      go.Shape,
      // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
      new go.Binding('stroke', 'isHighlighted', (h) => {
        return h ? '#1ec887' : 'black';
      }).ofObject(),
      new go.Binding('strokeWidth', 'isHighlighted', (h) => {
        return h ? 3 : 1;
      }).ofObject()
    ),
    $(
      go.Shape, {
        toArrow: 'Standard',
        strokeWidth: 0
      },
      // bind Shape.fill to Link.isHighlighted
      new go.Binding('fill', 'isHighlighted', (h) => {
        return h ? '#1ec887' : 'black';
      }).ofObject(),
      new go.Binding('fill', 'isSelected', (sel) => {
        return sel ? '#1e90ff' : 'black';
      }).ofObject()
    )
  ));
}

// returns node tooltip
function createToolTip() {
  return (ToolTip = $(
    'ToolTip', {
      'Border.fill': '#ffffffdd'
    },
    $(
      go.Panel,
      'Vertical',
      $(go.TextBlock, {
        text: 'Course Information',
        font: '12pt sans-serif',
        alignment: go.Spot.Left
      }),
      $(
        go.TextBlock, {
          margin: 4,
          width: 300,
          wrap: go.TextBlock.WrapFit
        },
        new go.Binding('text', '', (data) => {
          return `${data.title} \nPre-reqs: ${data.prereqText}`;
        })
      )
    )
  ));
}

// returns contextmenu
function createContextMenu() {
  return (ContextMenu = $(
    'ContextMenu',
    $(
      'ContextMenuButton', {
        'ButtonBorder.fill': 'white',
        _buttonFillOver: '#ededed',
      },
      $(go.TextBlock, 'Course Page'), {
        click: (e, obj) => {
          window.open(obj.part.data.url);
        },
      }
    ),
    $(
      'ContextMenuButton', {
        'ButtonBorder.fill': 'white',
        _buttonFillOver: '#ededed',
      },
      $(go.TextBlock, 'Inverse Graph'), {
        click: (e, obj) => {
          openInverseGraph(obj);
        },
      }
    )
  ));
}

function openInverseGraph(obj) {
  const key = obj.part.data.key.split(' ');
  window.open(`/subject/${key[0]}/course/${key[1]}`);
}
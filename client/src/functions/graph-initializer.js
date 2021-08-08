import * as go from 'gojs';
import { isTouchDevice, isMobileDevice, getHighlightedNodes } from './utils';
import { nodeClickHandler } from './node-event-handler';

// $ is a function pointer for go.GraphObject.make()
const $ = go.GraphObject.make;

export default function createGraph(params) {
  return getGraph();
}

// returns new graph
function getGraph() {
  return $(go.Diagram, {
    'undoManager.isEnabled': true,
    'toolManager.hoverDelay': 500,
    'toolManager.toolTipDuration': 30000,
    initialAutoScale: go.Diagram.Uniform,
    InitialLayoutCompleted: (obj) => {
      setColors(obj.diagram);
    },
    layout: createLayout(),
    nodeTemplate: createNodeTemplate(),
    linkTemplate: createLinkTemplate(),
    allowDelete: false,
    allowCopy: false,
    allowMove: false,
    allowInsert: false,
    model: $(go.GraphLinksModel, {
      linkKeyProperty: 'key',
    }),
  });
}

// sets node and link highlight and clickable values using the 'nodes' URL query parameter
function setColors(graphh) {
  const highlightedNodes = getHighlightedNodes();
  // if param is passed (not null)
  if (highlightedNodes && graphh) {
    // until all nodes are highlighted, remove the first node, find it in the graph, simulate a click on the node
    // if the node is not highlighted, add it back to the array
    // (this handles the case where a prereq node is present after the node in the query parameter)
    while (highlightedNodes.length !== 0) {
      const elem = highlightedNodes.shift();
      const graphNode = graphh.findNodeForKey(elem);
      if (graphNode) {
        nodeClickHandler(graphNode);
        if (!graphNode.isHighlighted) {
          highlightedNodes.push(elem);
        }
      }
    }
  }
}

// returns new layout
function createLayout() {
  return $(go.LayeredDigraphLayout, {
    direction: 0,
    layerSpacing: 100,
    columnSpacing: 10,
    linkSpacing: 7,
    layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
  });
}

// retuns new node template
function createNodeTemplate() {
  return $(
    go.Node,
    'Auto',
    {
      selectionAdorned: false,
      click: (e, node) => {
        nodeClickHandler(node);
      },
      toolTip: createToolTip(),
      contextMenu: createContextMenu(),
    },
    $(
      go.Shape,
      'Rectangle',
      {
        strokeWidth: 2,
        stroke: '#000',
        name: 'shape',
      },
      // bind Shape.scale and Shape.fill to Node.isHighlighted, Node.data.isClickable and Node.data.isSearched
      new go.Binding('scale', '', (node) => {
        return node.data.isSearched ? 1.3 : 1;
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
      'course id',
      {
        // default text and text config
        margin: 12,
        stroke: '#fff',
        font: 'bold 16px sans-serif',
      },
      new go.Binding('text', 'key')
    )
  );
}

// returns new link template
function createLinkTemplate() {
  return $(
    go.Link,
    {
      routing: go.Link.Normal,
      corner: 0,
    },
    $(
      go.Shape,
      // bind Shape.stroke and Shape.strokeWidth to Link.isHighlighted
      new go.Binding('stroke', 'isHighlighted', (h) => {
        return h ? '#1ec887' : '#000';
      }).ofObject(),
      new go.Binding('strokeWidth', 'isHighlighted', (h) => {
        return h ? 3 : 1;
      }).ofObject()
    ),
    $(
      go.Shape,
      {
        toArrow: 'Standard',
        strokeWidth: 0,
      },
      // bind Shape.fill to Link.isHighlighted
      new go.Binding('fill', 'isHighlighted', (h) => {
        return h ? '#1ec887' : '#000';
      }).ofObject(),
      new go.Binding('fill', 'isSelected', (sel) => {
        return sel ? '#1e90ff' : '#000';
      }).ofObject()
    )
  );
}

// returns node tooltip if device is not a touch mobile device, otherwise returns null
// this is because the tooltip interferes with the clicking of nodes on touch devices
function createToolTip() {
  if (isTouchDevice() && isMobileDevice()) {
    return null;
  }
  return $(
    'ToolTip',
    {
      'Border.fill': '#ffffff',
    },
    $(
      go.Panel,
      'Vertical',
      $(go.TextBlock, {
        margin: new go.Margin(0, 2, 2, 4),
        text: 'Course Information',
        font: '11pt sans-serif',
        alignment: go.Spot.Left,
        wrap: go.TextBlock.WrapFit,
      }),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(0, 2, 2, 4),
          width: 300,
          alignment: go.Spot.Left,
          font: '10pt sans-serif',
          wrap: go.TextBlock.WrapFit,
        },
        new go.Binding('text', '', (data) => {
          return `${data.title}`;
        })
      ),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(0, 2, 0, 4),
          width: 300,
          alignment: go.Spot.Left,
          font: '9pt sans-serif',
          wrap: go.TextBlock.WrapFit,
        },
        new go.Binding('text', '', (data) => {
          return `Pre-reqs: ${data.prereqText}`;
        })
      )
    )
  );
}

// returns contextmenu
function createContextMenu() {
  return $(
    'ContextMenu',
    getContextMenuButton('Course Page', 'text1', 'shape1', (e, obj) => {
      window.open(obj.part.data.url);
    }),
    getContextMenuButton('Course Graph', 'text2', 'shape2', (e, obj) => {
      openCourseGraph(obj);
    })
  );
}

// opens new tab (for hover menu)
function openCourseGraph(obj) {
  const key = obj.part.data.key.split(' ');
  window.open(`/subject/${key[0]}/course/${key[1]}`);
}

// returns ContextMenuButton
function getContextMenuButton(label, textBox, Shape, func) {
  return $(
    'ContextMenuButton',
    $(go.Shape, 'Rectangle', {
      stroke: null,
      maxSize: new go.Size(95, 25),
      fill: '#fff',
      name: Shape,
    }),
    $(go.TextBlock, label, {
      name: textBox,
      background: '#fff',
      font: '14px sans-serif',
      click: func,
    }),
    {
      mouseEnter: (e, obj) => {
        obj.findObject(Shape).fill = '#0d6efd';
        obj.findObject(textBox).background = '#0d6efd';
        obj.findObject(textBox).stroke = '#fff';
      },
      mouseLeave: (e, obj) => {
        obj.findObject(Shape).fill = '#fff';
        obj.findObject(textBox).background = '#fff';
        obj.findObject(textBox).stroke = '#000';
      },
    }
  );
}

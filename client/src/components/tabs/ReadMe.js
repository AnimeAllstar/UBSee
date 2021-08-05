import React from 'react';
import { Tab } from '../Tab';

const ReadMe = () => {
  return (
    <Tab title="README" id="readme-tab" color="text-primary">
      <ul className="list-group">
        {/* How To Use Section */}
        <li className="list-group-item rounded-0">
          <h6>How can this tool help you?</h6>
          <p>
            This tool can help make it easier to visualize course eligibilities. It can also help you find the course path you need to take in order
            to satisfy the requirements of a higher level course.
          </p>
          <h6>How to Use</h6>
          <p>
            <i className="text-primary"> Subject / Course Selection </i>
            <br />
            Use the dropdown menus to create a subject graph or a course graph.
            <br />
            You can <i className="text-primary"> search </i> for courses in the dropdown by typing the course name / number in the search bar in the
            dropdown.
          </p>
          <p>
            Click the 'Copy URL' button to copy the URL of the current graph.{' '}
            <i className="text-primary">
              The copied url also contains a list of currently selected nodes so you will not have to re-select nodes if you visit UBSee using the
              copied link.
            </i>
          </p>
          <p>
            Leave the course dropdown empty to create a subject graph.
            <br />
            Adjust the slider to create subject graphs containing courses upto a certain year.
          </p>
          <p>
            <i className="text-primary"> Tools </i>
            <br />
            Use the input field to <i className="text-primary"> search </i> for courses within the graph. You can search using course code or titles.
            eg: 'econ 101', '101' 'Micro', 'Microecon', etc. Click 'Clear' to clear all searches.
            <br />
            Use the focus checkboxes to <i className="text-primary"> focus </i> on courses of a certain year.
          </p>
          <p>
            <i className="text-primary"> Preferences </i>
            <br />
            Includes options to change graph appearance settings.
          </p>
          <hr />
          <p>The Nodes represent a specific course, ex: CPSC 110.</p>
          <p>
            The lines between courses represent the prerequisites between courses. <i className="text-primary">Hover </i> over a course for detailed
            prerequisite information.
          </p>
          <p>
            Nodes can be <i className="text-primary"> left-clicked </i> to indicate that the requirement as satisfied.
          </p>
          <p></p>
          <div className="d-inline-block">
            <svg width={20} height={20}>
              <rect
                width={20}
                height={20}
                style={{
                  fill: '#1ec887',
                  strokeWidth: 3,
                  stroke: 'rgb(0,0,0)',
                }}
              />
            </svg>
            <span>Eligible</span>
          </div>
          <div className="d-inline-block">
            <svg width={20} height={20}>
              <rect
                width={20}
                height={20}
                style={{
                  fill: '#1e90ff',
                  strokeWidth: 3,
                  stroke: 'rgb(0,0,0)',
                }}
              />
            </svg>
            <span>Satisfied</span>
          </div>
          <div className="d-inline-block">
            <svg width={20} height={20}>
              <rect
                width={20}
                height={20}
                style={{
                  fill: '#ff1a53',
                  strokeWidth: 3,
                  stroke: 'rgb(0,0,0)',
                }}
              />
            </svg>
            <span>Ineligible</span>
          </div>
          <p />
          <p>
            <i className="text-primary"> Right-click </i> on a node to see the UBC course page link and the UBSee course graph link.
          </p>
          <p className="mb-1">
            <i className="text-primary"> Ctrl + z </i> is undo and <i className="text-primary"> Ctrl + y </i> is redo. This means that you can
            de-select nodes if you accidentally click something. The graph has to be selected (click anywhere on the graph background to select it).
          </p>
        </li>
      </ul>
    </Tab>
  );
};

export default ReadMe;

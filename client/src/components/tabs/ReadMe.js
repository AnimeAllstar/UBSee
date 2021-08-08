import React from 'react';

import { Tab } from '../Tab';
import { ListGroup } from '../ListGroup';
import { ColorBox } from '../ColorBox';
import { isMobileDevice, isTouchDevice } from '../../functions/utils';

// ReadMe Tab in ../Tabs
const ReadMe = () => {
  return (
    <Tab title="README" id="readme-tab" color="#0d6efd">
      <ListGroup>
        {/* How To Use Section */}
        <ListGroup.Item>
          <h6>How can this tool help you?</h6>
          <p>
            This tool can help make it easier to visualize course eligibilities. It can also help you find the course path you need to take in order
            to satisfy the requirements of a higher level course.
          </p>
          <h6>How to Use</h6>
          <p>
            <i> Subject / Course Selection </i>
            <br />
            Use the dropdown menus to create a subject graph or a course graph.
            <br />
            You can <i> search </i> for courses in the dropdown by typing the course name / number in the search bar in the dropdown.
          </p>
          <p>
            Click the 'Copy url' button to copy the URL of the current graph.{' '}
            <i>
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
            Click the 'Create' button to replace the graph on the current page to the new graph. <br />
            Click the 'New tab' button to create the selected graph in a new tab.
          </p>
          <p>
            <i> Tools </i>
            <br />
            Use the input field to <i> search </i> for courses within the graph. You can search using course code or titles. eg: 'econ 101', '101'
            'Micro', 'Microecon', etc. Click 'Clear' to clear all searches.
            <br />
            Use the focus checkboxes to <i> focus </i> on courses of a certain year.
          </p>
          <p>
            <i> Preferences </i>
            <br />
            Includes options to change graph appearance settings.
          </p>
          <hr />
          <p>The Nodes represent a specific course, ex: CPSC 110.</p>
          {!isTouchDevice() || !isMobileDevice() ? (
            // desktop devices have hover enabled
            <>
              <p>
                The lines between courses represent the prerequisites between courses. <i> Hover </i> over a course for detailed prerequisite
                information.
              </p>
              <p>
                Nodes can be <i> left-clicked </i> to indicate that the requirement as satisfied.
              </p>
            </>
          ) : (
            // mobile touch devices
            <>
              <p>The lines between courses represent the prerequisites between courses.</p>
              <p>
                Nodes can be <i> tapped or left-clicked </i> to indicate that the requirement as satisfied.
              </p>
            </>
          )}
          <p />
          <ColorBox color="#1ec887">
            <ColorBox.Text text="Eligible" />
          </ColorBox>
          <ColorBox color="#1e90ff">
            <ColorBox.Text text="Satisfied" />
          </ColorBox>
          <ColorBox color="#ff1a53">
            <ColorBox.Text text="Ineligible" />
          </ColorBox>
          <p />
          {!isTouchDevice() || !isMobileDevice() ? (
            // desktop devices
            <>
              <p>
                <i> Right-click </i> on a node to see the UBC course page link and the UBSee course graph link.
              </p>
              <p className="mb-1">
                <i> Ctrl + z </i> is undo and <i> Ctrl + y </i> is redo. This means that you can de-select nodes if you accidentally click something.
                The graph has to be selected (click anywhere on the graph background to select it).
              </p>
            </>
          ) : (
            // mobile devices cannot access the undo manager and hover feature
            <>
              <p>
                <i> long-Press </i> on a node to see the UBC course page link and the UBSee course graph link.
              </p>
              <p className="mb-1">
                <i> Ctrl + z </i> is undo and <i> Ctrl + y </i> is redo. This means that you can de-select nodes if you accidentally click something.
                The graph has to be selected (click anywhere on the graph background to select it). <i>You need a keyboard for this to work</i>.
                <br />
              </p>
            </>
          )}
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default ReadMe;

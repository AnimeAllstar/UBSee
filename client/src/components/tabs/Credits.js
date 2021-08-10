import React from 'react';

import { Tab } from '../Tab';
import { ListGroup } from '../ListGroup';

// Credits Tab in ../Tabs
const Feedback = () => {
  return (
    <Tab id="credits-tab" title="Credits">
      <ListGroup>
        {/* Credits */}
        <ListGroup.Item>
          <ul className="my-1">
            <li style={{ listStyleType: '' }}>
              UBSee icon made by Freepik from{' '}
              <a href="https://www.flaticon.com/" target="_blank" rel="noreferrer">
                www.flaticon.com
              </a>
            </li>
            <li>
              Use of GoJS made under their{' '}
              <a href="https://www.nwoods.com/sales/academic-use.html" target="_blank" rel="noreferrer">
                Academic Use
              </a>{' '}
              policy
            </li>
            <li>
              Course data provided by{' '}
              <a href="https://ubcexplorer.io/api" target="_blank" rel="noreferrer">
                ubcexplorer
              </a>{' '}
              and{' '}
              <a href="https://github.com/StuffByLiang/realtime-ubc-courses-api" target="_blank" rel="noreferrer">
                ubccourses
              </a>
            </li>
          </ul>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Feedback;

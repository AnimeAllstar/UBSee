import React from 'react';

import { Tab } from '../Tab';
import { ListGroup } from '../ListGroup';

// Notice Tab in ../Tabs
const Notice = () => {
  return (
    <Tab id="notice-tab" title="Warning!" color="#dc3545">
      <ListGroup>
        {/* Warning on how to use */}
        <ListGroup.Item>
          <h6>Be Careful!</h6>
          <p>
            This program may not be accurately representative of the actual course requirements displayed on SSC as the information may become
            outdated. Always refer to SSC information to confirm important information.
          </p>
          <p>
            Due to graphs becoming too complex, only prerequisites of the same subject are displayed on screen. We recommend always confirming the
            information on SSC.
          </p>
          <p className="mb-1">
            This website is meant to aid students to visualize course eligibilities and to reduce the time students spend on course planning. We will
            not be held responsible for any damages.
          </p>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Notice;

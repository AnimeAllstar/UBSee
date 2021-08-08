import React from 'react';

import Tools from './tabs/Tools';
import Selection from './tabs/Selection';
import Preferences from './tabs/Preferences';
import ReadMe from './tabs/ReadMe';
import Notice from './tabs/Notice';
import Feedback from './tabs/Feedback';
import Credits from './tabs/Credits';

// returns boostrap accordian
const Tabs = () => {
  return (
    <div className="accordion w-100" id="sidebar-accordian">
      <Selection />
      <Tools />
      <Preferences />
      <ReadMe />
      <Notice />
      <Feedback />
      <Credits />
    </div>
  );
};

export default Tabs;

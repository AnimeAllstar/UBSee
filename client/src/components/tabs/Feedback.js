import React from 'react';
import { Tab } from '../Tab';

const Feedback = () => {
  return (
    <Tab id="feedback-tab" title="Report / Feedback">
      <ul className="list-group">
        <li className="list-group-item rounded-0">
          <h6>Want to report a bug? Have feedback or features suggestions for UBSee?</h6>
          <p>Click the button below to go to the feedback form.</p>
          <p>
            You can inform us about outdated course infromation, bugs and feature suggestions, or make requests for new courses and give us feedback
            about UBsee.
          </p>
          <p>
            If you know how to code and use Github, head over to{' '}
            <a href="https://github.com/AnimeAllstar/UBSee" target="_blank">
              UBSee's Github Page
            </a>{' '}
            to{' '}
            <a href="https://github.com/AnimeAllstar/UBSee#how-to-contribute" target="_blank">
              contribute
            </a>
            or to make an{' '}
            <a href="https://github.com/AnimeAllstar/UBSee/issues" target="_blank">
              issue
            </a>
            .
          </p>
          <p className="mb-1">Let's try and improve UBSee together so that more people will benefit from using it!</p>
        </li>
        <li className="list-group-item rounded-0">
          <a href="https://gitreports.com/issue/AnimeAllstar/UBSee/" target="_blank">
            <button type="button" className="btn btn-outline-primary">
              Feedback Form
            </button>
          </a>
        </li>
      </ul>
    </Tab>
  );
};

export default Feedback;

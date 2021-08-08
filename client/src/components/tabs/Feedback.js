import React from 'react';
import { ListGroup } from '../ListGroup';

import { Tab } from '../Tab';

const Feedback = () => {
  return (
    <Tab id="feedback-tab" title="Report / Feedback">
      <ListGroup>
        <ListGroup.Item>
          <h6>Want to report a bug? Have feedback or features suggestions for UBSee?</h6>
          <p>Click the button below to go to the feedback form.</p>
          <p>
            You can inform us about outdated course infromation, bugs and feature suggestions, or make requests for new courses and give us feedback
            about UBsee.
          </p>
          <p>
            If you know how to code and use Github, head over to{' '}
            <a href="https://github.com/AnimeAllstar/UBSee" target="_blank" rel="noreferrer">
              UBSee's Github Page
            </a>{' '}
            to{' '}
            <a href="https://github.com/AnimeAllstar/UBSee#how-to-contribute" target="_blank" rel="noreferrer">
              contribute
            </a>
            or to make an{' '}
            <a href="https://github.com/AnimeAllstar/UBSee/issues" target="_blank" rel="noreferrer">
              issue
            </a>
            .
          </p>
          <p className="mb-1">Let's try and improve UBSee together so that more people will benefit from using it!</p>
        </ListGroup.Item>
        <ListGroup.Item>
          <a href="https://gitreports.com/issue/AnimeAllstar/UBSee/" target="_blank" rel="noreferrer">
            <button type="button" className="btn btn-outline-primary">
              Feedback Form
            </button>
          </a>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Feedback;

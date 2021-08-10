import React from 'react';

import { SuitHeartFill } from 'react-bootstrap-icons';

// returns div with Message
const Message = () => {
  return (
    <>
      <div className="alert alert-success rounded-0" role="alert">
        <h6 className="alert-heading">Latest features</h6>
        <p className="mb-0">
          <small>
            - Smoother UI
            <br />
            - Added yellow loading spinner
            <br />
            - 'Create' button in the 'Selection' tab now updates graph on the current page
            <br />
            - Added 'New tab' button in the 'Selection' tab that creates a new graph in a new tab
            <br />
            - README tab now displays instructions based on the type of device (mobile / desktop)
            <br />
            - Added 'Credits' tab
            <br />
          </small>
        </p>
      </div>
      <p className="text-white small text-center" style={{ fontFamily: 'Open Sans,sans-serif' }}>
        {' '}
        Made with <SuitHeartFill color="#dc3545" size={11} /> by{' '}
        <a href="https://github.com/AnimeAllstar" target="_blank" rel="noreferrer" style={{ color: '#20c997' }}>
          <span className="d-inline-block">Asad Dhorajiwala</span>
        </a>{' '}
        and{' '}
        <a href="https://github.com/L0Lmaker" target="_blank" rel="noreferrer" style={{ color: '#ffc107' }}>
          <span className="d-inline-block">Rithin Kumar RS</span>
        </a>
      </p>
    </>
  );
};

export default Message;

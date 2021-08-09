import React from 'react';
import { useData } from '../contexts/DataContext';

const Error = () => {
  const { ErrorMessage, currentGraph } = useData();

  const Message = ({ name, type, def }) => {
    if (!def) {
      return (
        <>
          <p>
            Please check the whether <span className="text-primary">{name}</span> is a reference to a {type} supported by UBSee
          </p>
          <p>
            If you believe it is a valid {type} try again later or try creating another graph to check if this is the only affected graph. <br />
            If the issue persists you can inform us by making a report{' '}
            <a href="https://gitreports.com/issue/AnimeAllstar/UBSee/" target="_blank" rel="noreferrer">
              here
            </a>{' '}
            or by creating an issue on{' '}
            <a href="https://github.com/AnimeAllstar/UBSee/issues" target="_blank" rel="noreferrer">
              Github
            </a>
            .
          </p>
        </>
      );
    } else {
      return (
        <p>
          An unnexpected erorr has occured while connecting to the server. Please try creating the graph again or try again later.
          <br />
          <br />
          If the issue persists you can inform us by making a report{' '}
          <a href="https://gitreports.com/issue/AnimeAllstar/UBSee/" target="_blank" rel="noreferrer">
            here
          </a>{' '}
          or by creating an issue on{' '}
          <a href="https://github.com/AnimeAllstar/UBSee/issues" target="_blank" rel="noreferrer">
            Github
          </a>
          .
        </p>
      );
    }
  };

  const RenderMessage = () => {
    if (ErrorMessage === 'Invalid Course') {
      return <Message name={`${currentGraph.subject} ${currentGraph.course}`} type="course" def={false} />;
    } else if (ErrorMessage === 'Invalid Subject') {
      return <Message name={currentGraph.subject} type="subject" def={false} />;
    } else {
      return <Message def={true} />;
    }
  };

  return (
    <div className="d-flex justify-content-center h-100">
      <div className="my-auto mx-3">
        <h3 className="text-center">{ErrorMessage ? ErrorMessage : 'Error while connecting to the server'}</h3>
        <h6 className="text-center fw-normal">
          <RenderMessage />
        </h6>
      </div>
      <br />
    </div>
  );
};

export default Error;

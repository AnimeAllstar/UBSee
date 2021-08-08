import React from 'react';
import { useData } from '../contexts/DataContext';

const Error = () => {
  const { currentGraph } = useData();

  return (
    <div className="d-flex justify-content-center h-100">
      <div className="my-auto">
        <h3 className="text-center">Error while trying to fetch data from the server</h3>
        <h6 className="text-center fw-normal">
          <p>
            Please check the whether <span className="text-primary">{`${currentGraph.subject || ''} ${currentGraph.course || ''}`}</span> is a
            reference to a subject/course supported by UBSee
          </p>
          <p>
            If you believe it is a valid subject/course try again later or try creating another graph to check if this is the only affected graph.{' '}
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
        </h6>
      </div>
      <br />
    </div>
  );
};

export default Error;

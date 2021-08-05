import React from 'react';
import { Tab } from '../Tab';

const Tools = () => {
  return (
    <Tab title="Tools" id="tools-tab">
      <ul className="list-group">
        {/* Search */}
        <li className="list-group-item rounded-0">
          <h6>Search</h6>
          <span>Search for a node within the graph.</span>
          <div className="input-group my-2">
            <input
              type="search"
              className="form-control"
              placeholder="Enter search string"
              id="search-input"
              onkeypress="if (event.keyCode === 13) searchGraph()"
            />
            <button className="btn btn-outline-primary" type="button" id="button-addon2" onclick="searchGraph()">
              Search
            </button>
            <button className="btn btn-outline-primary border-start-0" type="button" onclick="clearSelection()">
              Clear
            </button>
          </div>
        </li>
        {/* Focus */}
        <li className="list-group-item rounded-0">
          <h6>Focus</h6>
          <span>Select year levels you want to focus on.</span>
          <br />
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="focus" defaultValue={1} defaultChecked />
            <label className="form-check-label" htmlFor={1}>
              year 1
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="focus" defaultValue={2} defaultChecked />
            <label className="form-check-label" htmlFor={2}>
              year 2
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="focus" defaultValue={3} defaultChecked />
            <label className="form-check-label" htmlFor={3}>
              year 3
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="focus" defaultValue={4} defaultChecked />
            <label className="form-check-label" htmlFor={4}>
              year 4
            </label>
          </div>
        </li>
        <li className="list-group-item rounded-0">
          <button type="button" className="btn btn-outline-primary" onclick="updateFocus()">
            Set Focus
          </button>
        </li>
      </ul>
    </Tab>
  );
};

export default Tools;

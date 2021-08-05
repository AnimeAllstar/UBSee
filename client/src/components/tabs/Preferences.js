import React from 'react';
import { Tab } from '../Tab';

const Preferences = () => {
  return (
    <Tab id="preferences-tab" title="Preferences">
      <ul className="list-group">
        {/* Direction */}
        <li className="list-group-item rounded-0">
          <h6>Direction</h6>
          <span>Select the direction of the graph</span>
          <br />
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="direction" defaultValue={0} defaultChecked />
            <label className="form-check-label" htmlFor="right">
              Right
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="direction" defaultValue={90} />
            <label className="form-check-label" htmlFor="down">
              Down
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="direction" defaultValue={180} />
            <label className="form-check-label" htmlFor="left">
              Left
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="direction" defaultValue={270} />
            <label className="form-check-label" htmlFor="up">
              Up
            </label>
          </div>
        </li>
        {/* Layering */}
        <li className="list-group-item rounded-0">
          <h6>Layering</h6>
          <span>Select the layering style of the graph</span>
          <br />
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="layering" defaultValue={0} defaultChecked />
            <label className="form-check-label" htmlFor="right">
              Longest path from source
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="layering" defaultValue={1} />
            <label className="form-check-label" htmlFor="down">
              Longest path to sink
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="layering" defaultValue={2} />
            <label className="form-check-label" htmlFor="down">
              Optimal link length
            </label>
          </div>
        </li>
        <li className="list-group-item rounded-0">
          <button type="button" className="btn btn-outline-primary" onclick="updateAppearance()">
            Update
          </button>
        </li>
      </ul>
    </Tab>
  );
};

export default Preferences;

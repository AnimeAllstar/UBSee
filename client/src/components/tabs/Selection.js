import React from 'react';
import { Tab } from '../Tab';

const Selection = () => {
  return (
    <Tab title="Subject / Course Selection" id="selection-tab">
      <ul className="list-group">
        <li className="list-group-item rounded-0">
          <div className="input-group mb-3 mt-2">
            {/* Subject Selection*/}
            <select id="subject-select" name="subject">
              <option value />
            </select>
          </div>
          <div className="input-group mb-2">
            {/* Course Selection*/}
            <select id="course-select" name="course">
              <option value />
            </select>
          </div>
        </li>
        {/* Display Range */}
        <li className="list-group-item rounded-0">
          <h6>Max Year Level</h6>
          <span id="displayRangeText">Display courses up to year 4</span>
          <br />
          <span>
            <small>(only works on subject graphs)</small>
          </span>
          <br />
          <input
            type="range"
            className="form-range"
            id="displayRange"
            min={1}
            max={4}
            step={1}
            defaultValue={4}
            onchange="updateDisplayText(this.value)"
          />
        </li>
        {/* Copy to clipboard button */}
        <li className="list-group-item rounded-0">
          <button type="button" className="btn btn-outline-primary" onclick="openTab()">
            Create
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="tooltip"
            onclick="copyToClipboard();"
            title="Copy url of current graph to clipboard"
            id="copyBtn"
          >
            Copy URL
          </button>
        </li>
      </ul>
    </Tab>
  );
};

export default Selection;

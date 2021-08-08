import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { ButtonGroup, Button } from 'react-bootstrap';

import { Tab } from '../Tab';
import { Item, ListGroup } from '../ListGroup';
import { useData } from '../../contexts/DataContext';

// Selection Tab in ../Tabs
const Selection = () => {
  const [year, setYear] = useState(4);

  const [selectData, setSelectData] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedSubject, setselectedSubject] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courseRef = useRef(null);
  const copyBtn = useRef(null);

  const { graphRef, updateGraphState } = useData();

  // fetches and sets subject and course options for <Select> components
  // stores data from '/api/subjects' route in selectData so that it doesn't have to be fetched again
  useEffect(() => {
    const getSubjectOptions = async () => {
      const response = await fetch('http://localhost:8080/api/subjects');
      const subjectsJson = await response.json();

      const subjectData = subjectsJson.map((subject) => {
        return { value: subject.name, label: subject.name };
      });
      setSubjectOptions([...subjectData]);

      const apiData = subjectsJson.map((subject) => {
        return {
          name: subject.name,
          courses: subject.courses.map((course) => {
            const split = course.split(' ');
            return { value: `${split[0]} ${split[1]}`, label: course };
          }),
        };
      });
      setSelectData([...apiData]);
    };

    getSubjectOptions();
  }, []);

  // adds event listener to copyBtn
  useEffect(() => {
    copyBtn.current.addEventListener('hidden.bs.tooltip', () => {
      copyBtn.current.setAttribute('data-bs-original-title', 'Copy url of current graph to clipboard');
    });
  }, []);

  // if selected subject changes, sets selected course to null and set course options to match the subject
  // then calls courseRef.current.select.clearValue() to rerender course select <Select>
  useEffect(() => {
    if (selectedSubject && selectData) {
      const subject = selectData.find((subject) => {
        return subject.name === selectedSubject.value;
      });
      setSelectedCourse(null);
      setCourseOptions([...subject.courses]);
      courseRef.current.select.clearValue();
    }
  }, [selectData, selectedSubject]);

  // Calls updateGraphState from DataContext if selectedSubject is present
  const updateGraph = () => {
    if (selectedSubject) {
      if (selectedCourse) {
        updateGraphState(selectedSubject.value, selectedCourse.value.split(' ')[1], 4);
      } else {
        updateGraphState(selectedSubject.value, selectedCourse, year);
      }
    }
  };

  // gets new URL by setting the 'nodes' search parameter to the current page url
  // the 'nodes' parameter is a comma separated string containing all selected nodes
  const getNewURL = () => {
    const url = new URL(window.location.href);
    let nodeArr = [];
    graphRef.current.getDiagram().nodes.each((node) => {
      if (node.isHighlighted) {
        nodeArr.push(node.data.key);
      }
    });
    url.searchParams.set('nodes', nodeArr.join(','));
    return url;
  };

  return (
    <Tab title="Subject / Course Selection" id="selection-tab">
      <ListGroup>
        {/* Subject and Course Selection */}
        <ListGroup.Item>
          <Select defaultValue={selectedSubject} onChange={setselectedSubject} options={subjectOptions} />
          <br />
          <Select ref={courseRef} defaultValue={selectedCourse} onChange={setSelectedCourse} options={courseOptions} isClearable />
        </ListGroup.Item>
        {/* Display Range */}
        <ListGroup.Item>
          <Item.Title>Max Year Level</Item.Title>
          <Item.Description>
            Display courses up to year {year}
            <br />
            <small>(only works on subject graphs)</small>
            <br />
          </Item.Description>
          <Item.Body>
            <input type="range" className="form-range" min={1} max={4} step={1} defaultValue={year} onChange={(e) => setYear(e.target.value)} />
          </Item.Body>
        </ListGroup.Item>
        {/* Copy to clipboard and Update buttons */}
        <ListGroup.Item>
          <ButtonGroup>
            <Button variant="outline-primary" onClick={updateGraph}>
              Update
            </Button>
            <Button
              ref={copyBtn}
              variant="outline-primary"
              onClick={() => {
                navigator.clipboard.writeText(getNewURL());
              }}
            >
              Copy
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Selection;

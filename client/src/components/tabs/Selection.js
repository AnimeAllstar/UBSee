import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { ButtonGroup, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

import { Tab } from '../Tab';
import { Item, ListGroup } from '../ListGroup';
import { useData } from '../../contexts/DataContext';
import { getRoute, getUrl } from '../../functions/utils';

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

  const { handleError, graphRef, updateGraphState } = useData();

  // fetches and sets subject and course options for <Select> components
  // stores data from '/api/subjects' route in selectData so that it doesn't have to be fetched again
  useEffect(() => {
    const getSubjectOptions = async () => {
      try {
        const response = await fetch(getUrl('/api/subjects'));
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
      } catch (e) {
        handleError(new Error('Unable to fetch Graph data'));
      }
    };

    getSubjectOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        updateGraphState(selectedSubject.value, selectedCourse.value.split(' ')[1], 4, null);
      } else {
        updateGraphState(selectedSubject.value, selectedCourse, year, null);
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

  // opens selected graph in new tab using selectedSubject, selectedCourse and year
  const openInNewTab = () => {
    if (selectedSubject) {
      const course = selectedCourse ? selectedCourse.value.split(' ')[1] : null;
      window.open(getRoute(selectedSubject.value, course, year));
    }
  };

  const selectStyle = {
    option: (provided) => ({
      ...provided,
      padding: '6px',
      fontSize: '15px',
    }),
  };

  const renderTooltip = (text, props) => <Tooltip {...props}>{text}</Tooltip>;

  return (
    <Tab title="Subject / Course Selection" id="selection-tab">
      <ListGroup>
        {/* Subject and Course Selection */}
        <ListGroup.Item>
          <Select
            defaultValue={selectedSubject}
            placeholder="Subject"
            onChange={setselectedSubject}
            options={subjectOptions}
            className="mb-3 mt-2"
            styles={selectStyle}
          />
          <Select
            ref={courseRef}
            defaultValue={selectedCourse}
            placeholder="Course"
            onChange={setSelectedCourse}
            options={courseOptions}
            className="mb-2 mt-2"
            styles={selectStyle}
            isClearable
          />
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
        {/* Copy to clipboard, Update Graph and Open in new tab buttons */}
        <ListGroup.Item>
          <ButtonGroup>
            <OverlayTrigger
              placement="top"
              delay={{ show: 200, hide: 100 }}
              overlay={(props) => renderTooltip('replace current graph with selected graph', { id: 'create-tooltip', ...props })}
            >
              <Button variant="outline-primary" onClick={updateGraph}>
                Create
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 200, hide: 100 }}
              overlay={(props) => renderTooltip('open selected graph in a new tab', { id: 'new-tooltip', ...props })}
            >
              <Button variant="outline-primary" onClick={openInNewTab}>
                New tab
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 200, hide: 100 }}
              overlay={(props) => renderTooltip('copy the url of the current graph to your clipboard', { id: 'copy-tooltip', ...props })}
            >
              <Button
                ref={copyBtn}
                variant="outline-primary"
                onClick={() => {
                  navigator.clipboard.writeText(getNewURL());
                }}
              >
                Copy url
              </Button>
            </OverlayTrigger>
          </ButtonGroup>
        </ListGroup.Item>
      </ListGroup>
    </Tab>
  );
};

export default Selection;

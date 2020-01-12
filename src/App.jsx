import React, { useState, useEffect } from 'react';

import Toast from './components/Toast';
import getResources from './actions/api';
import Button from './components/base/Button';
import Selector from './components/base/Selector';
import { formatError } from './actions/formatters';
import Table from './components/Table/Table';

const App = () => {
  const [ companyZones, setCompanyZones ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ filteredRes, setFilteredRes ] = useState([]);
  const [ resources, setResources ] = useState([]);
  const [ show, setShow ] = useState(false);
  const [ searching, setSearching ] = useState(false);

  useEffect(() => {
    if (searching) {
      getResources()
        .then((res) => {
          setCompanyZones(res && res.companyZones);
          setResources(res && res.resources);
          setFilteredRes(res && res.resources);
          setSearching(false);
        })
        .catch((err) => {
          setError(formatError(err));
          setShow(true);
          setSearching(false);
        });
    }
  }, [ searching ]);

  const filterCompanyZone = (companyZoneId) => {
    if (companyZoneId && resources && resources.length) {
      setFilteredRes(resources.filter((res) => res.companyZoneId === companyZoneId));
    } else {
      setFilteredRes(resources);
    }
  };

  return (
    <div className="App">
      <div className="resources-form shadow">
        <Button
          disabled={searching}
          onClick={() => setSearching(true)}
          text={searching ? 'Searching resources...' : 'Search resources'}
        />
        <Selector
          disabled={!companyZones || 0 === companyZones.length || searching}
          labelKey={null}
          onSelect={filterCompanyZone}
          options={companyZones}
          placeholder="Company Zone"
          valueKey={null}
        />
      </div>
      <Table
        className="shadow"
        columns={[
          { label: 'Licence Plate', value: 'licencePlate' },
          { label: 'Latitude', value: 'latitude' },
          { label: 'Longitude', value: 'longitude' },
          { label: 'Model', value: 'model' },
        ]}
        elementKey="id"
        elements={filteredRes}
      />
      <Toast text={error} onClick={() => setShow(false)} show={show} />
    </div>
  );
};

export default App;

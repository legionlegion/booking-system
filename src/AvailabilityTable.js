import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

const AvailabilityTable = () => {
  const [loading, setLoading] = useState(true);
  const columns = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [currentWeekRows, setCurrentWeekRows] = useState(new Array(7).fill().map(() => new Array(24).fill({occupied: 0, purpose: null})));
  const [nextWeekRows, setNextWeekRows] = useState(new Array(7).fill().map(() => new Array(24).fill({occupied: 0, purpose: null})));
  const [currentWeekVisible, setCurrentWeekVisible] = useState(true);

  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  let diffToMonday = currentDayOfWeek >= 1 ? currentDayOfWeek - 1 : 6; // If it's Sunday, we want to subtract 6 to get to previous Monday

  let currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - diffToMonday);
  currentWeekStart.setHours(0, 0, 0, 0); // set time to 00:00:00.000

  let nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7); // set to Monday of next week
  nextWeekStart.setHours(0, 0, 0, 0); // set time to 00:00:00.000

  const daysUntilMonday = (currentDayOfWeek + 6) % 7; // Days between current day and next Monday
  // Sunday is 6 days away, Monday is 0 days away, so that rows[0] is Mon and rows[6] is Sun

  const showNextWeek = () => {
    setCurrentWeekVisible(false);
  };

  const showCurrentWeek = () => {
    setCurrentWeekVisible(true);
  };

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        data.forEach(entry => {
          fillArray(entry.start_time, entry.end_time, entry.purpose, currentWeekRows, nextWeekRows);
        });
        let newCurr = JSON.parse(JSON.stringify(currentWeekRows));
        let newNext = JSON.parse(JSON.stringify(nextWeekRows));
        setCurrentWeekRows(newCurr);
        setNextWeekRows(newNext);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  }, [])

  function fillArray(start, end, purpose, currentWeekRows, nextWeekRows) {
    let startDate = new Date(start);
    let endDate = new Date(end);

    let currentWeekEnd = new Date(nextWeekStart);

    // Find out if the booking ends in the next week
    let crossesIntoNextWeek = endDate > currentWeekEnd;

    // Create a temporary end date for the current week
    let tempEndDate = crossesIntoNextWeek ? currentWeekEnd : endDate;

    // First fill the current week's rows
    fillRows(startDate, tempEndDate, purpose, currentWeekRows);

    // If the booking crosses into the next week, fill the next week's rows
    if (crossesIntoNextWeek) {
      // Create a temporary start date for the next week. 
      // If the booking starts in the current week, it should be the start of the next week
      // If the booking starts in the next week, it should be the start of the booking
      let tempStartDate = startDate < currentWeekEnd ? new Date(nextWeekStart) : startDate;

      // Fill the next week's rows
      fillRows(tempStartDate, endDate, purpose, nextWeekRows);
    }
  }

  function fillRows(start, end, purpose, rows) {
    // Get the starting and ending day and hour
    let startDate = new Date(start);
    let endDate = new Date(end);

    let startDay = startDate.getDay() - 1; // Adjusted to have Mon as 0, Tues as 1 etc
    if (startDay == -1) startDay = 6;
    let startHour = startDate.getHours();

    // Get the difference in hours
    let diffInHours = (endDate - startDate) / (1000 * 60 * 60);

    // Loop through the days and hours, updating the array
    let currentDay = startDay;
    let currentHour = startHour;
    for (let i = 0; i < diffInHours; i++) {
      rows[currentDay][currentHour] = { occupied: 1, purpose };
      currentHour++;

      if (currentHour === 24) { // If we've reached the end of the day
        currentHour = 0;
        currentDay++;
        if (currentDay === 7) { // If we've reached the end of the week
          currentDay = 0;
        }
      }
    }
  }

  const slotColumnCommonFields = {
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    disableColumnSelector: true,
    minWidth: 140,
    colSpan: (params) => {
      const index = parseInt(params.field.split("_")[1]);
      const rows = params.id < 7 ? currentWeekRows : nextWeekRows;
      const day = params.id < 7 ? params.id : params.id - 7;
      let colSpan = 1;
      let cellValue = rows[day][index];
      for (let i = index + 1; i < 24; i++) {
        if (cellValue.occupied && cellValue.purpose === rows[day][i].purpose) {
          colSpan += 1;
        } else {
          break;
        }
      }
      return colSpan;
    },
  };

  // Prepare your data for the grid, create column structure
  const columnsData = [
    { field: 'date', headerName: 'Date', width: 100, disableColumnMenu: true, disableColumnSelector: true, sortable: false },
    { field: 'day', headerName: 'Day / Time', width: 100, disableColumnMenu: true, disableColumnSelector: true, sortable: false }
  ]
  .concat(Array.from(Array(24).keys()).map(hour => ({
    field: `hour_${hour}`,
    headerName: `${hour.toString().padStart(2, '0')}:00`,
    valueGetter: (params) => params.row[`hour_${hour}`],
    ...slotColumnCommonFields
  })))
  const rowsData = currentWeekVisible
  ? currentWeekRows.map((day, i) => ({
      id: i,
      date: new Date(currentDate.getTime() + (i - daysUntilMonday) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      day: columns[i],
      ...day.reduce((prev, curr, j) => ({ ...prev, [`hour_${j}`]: curr.occupied ? curr.purpose : '' }), {})
    }))
  : nextWeekRows.map((day, i) => ({
      id: i + 7,
      date: new Date(currentDate.getTime() + (i + 7 - daysUntilMonday) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      day: columns[i],
      ...day.reduce((prev, curr, j) => ({ ...prev, [`hour_${j}`]: curr.occupied ? curr.purpose : '' }), {})
    }))
    

    const getCellClassName = (params) => {
      if (params.field !== 'date' && params.field !== 'day') {
        const hour = parseInt(params.field.split('_')[1]);
        const day = params.id < 7 ? params.id : params.id - 7;
        const rows = params.id < 7 ? currentWeekRows : nextWeekRows;
        if (rows[day][hour].occupied === 1) {
          const purpose = rows[day][hour].purpose;
          switch(purpose){
            case 'Ulti':
            case 'Badminton':
            case 'Dodgeball':
            case 'Spikeball':
            case 'Table Tennis':
            case 'Tembu Netball':
            case 'R4D':
            case 'Captains Ball':
            case 'Floorball':
            case 'Netball':
            case 'Tchoukball':
              return `${purpose.replace(/\s+/g, '').toLowerCase()}Cell`;
            case 'Basketball (W)':
              return 'basketballwCell';
            case 'Basketball (M)':
              return 'basketballmCell';
            default:
              return 'busyCell';
          }
        }
        return 'availableCell';
      }
      return '';
    };

    

    return loading ? 
    <div>Loading...</div>:
      (
        <>
          <Button onClick={showCurrentWeek}>
            <ArrowLeft />Previous Week
          </Button>
          <Button onClick={showNextWeek}>
            Next Week<ArrowRight />
          </Button>
          <h2>{currentWeekVisible ? 'Current Week' : 'Next Week'}</h2>
          <div style={{ height: 500, width: '100%', overflowY: 'auto' }}>
            <DataGrid
            columns={columnsData}
            rows={rowsData}
            getCellClassName={getCellClassName}
            sx={{
              '& .busyCell': {
                backgroundColor: 'red',
              },
              '& .availableCell': {
                backgroundColor: 'lightgreen',
              },
              '& .ultiCell': {
                backgroundColor: 'orange',
              },
              '& .badmintonCell': {
                backgroundColor: 'lightblue',
              },
              '& .dodgeballCell': {
                backgroundColor: 'green',
              },
              '& .spikeballCell': {
                backgroundColor: 'yellow',
              },
              '& .tabletennisCell': {
                backgroundColor: 'purple',
              },
              '& .tembunetballCell': {
                backgroundColor: 'brown',
              },
              '& .r4dCell': {
                backgroundColor: 'pink',
              },
              '& .captainsballCell': {
                backgroundColor: 'violet',
              },
              '& .basketballwCell': {
                backgroundColor: 'lightseagreen',
              },
              '& .basketballmCell': {
                backgroundColor: 'cyan',
              },
              '& .floorballCell': {
                backgroundColor: 'magenta',
              },
              '& .netballCell': {
                backgroundColor: 'grey',
              },
              '& .tchoukballCell': {
                backgroundColor: 'Fuchsia',
              },
            }}
            autoHeight
            disableRowSelectionOnClick
            hideFooter
            showCellVerticalBorder
            showColumnVerticalBorder
            disableColumnReorder    
          />
        </div>
      </>
    );
};

export default AvailabilityTable;
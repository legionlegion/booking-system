import React, { useEffect, useState } from 'react';
import { Button, Icon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

const AvailabilityTable = () => {
  const [loading, setLoading] = useState(true);
  const columns = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [currentWeekRows, setCurrentWeekRows] = useState(new Array(7).fill().map(() => new Array(24).fill(0)));
  const [nextWeekRows, setNextWeekRows] = useState(new Array(7).fill().map(() => new Array(24).fill(0)));
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
          fillArray(entry.start_time, entry.end_time, currentWeekRows, nextWeekRows);
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

  function fillArray(start, end, currentWeekRows, nextWeekRows) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    // decide which array to fill
    let newRows;
    // console.log("Start date: ", startDate);
    // console.log("Current week start: ", currentWeekStart);
    // console.log("Next week start: ", nextWeekStart)
    if (startDate >= currentWeekStart && startDate < nextWeekStart) {
      newRows = currentWeekRows;
    } else if (startDate >= nextWeekStart) {
      newRows = nextWeekRows;
    } else {
      return; // ignore dates outside current and next week
    }

    // Get the starting and ending day and hour
    let startDay = startDate.getDay() - 1; // Adjusted to have Mon as 0, Tues as 1 etc
    let startHour = startDate.getHours();
    // Get the difference in hours
    let diffInHours = (endDate - startDate) / (1000 * 60 * 60);
    // Loop through the days and hours, updating the array
    let currentDay = startDay;
    let currentHour = startHour;
    for (let i = 0; i < diffInHours; i++) {
      newRows[currentDay][currentHour] = 1;
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

  return loading ?
    <div>Loading...</div> :
    (
      <>
        <Button onClick={showCurrentWeek}>
          <ArrowLeft />Previous Week
        </Button>
        <Button onClick={showNextWeek}>
          Next Week<ArrowRight />
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="availability table">
            <TableHead>
              <TableRow>
                <TableCell size="small">Date</TableCell>
                <TableCell size="small">Day / Time</TableCell>
                {Array.from(Array(24).keys()).map(hour =>
                  <TableCell size="small" key={hour}>{hour.toString().padStart(2, '0')}:00</TableCell>
                )}
              </TableRow>
            </TableHead>
            {currentWeekVisible ?
              <TableBody>
                {currentWeekRows.map((day, i) =>
                  <TableRow key={i}>
                    <TableCell size="small">{new Date(currentDate.getTime() + (i - daysUntilMonday) * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                    <TableCell size="small">{columns[i]}</TableCell>
                    {day.map((hour, j) =>
                      <TableCell key={j}
                        size="small"
                        sx={{
                          backgroundColor: hour === 1 ? '#b90606' : '#90EE90',
                          textAlign: 'center',
                          fontSize: '10px'
                        }}>
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
              :
              <TableBody>
                {nextWeekRows.map((day, i) =>
                  <TableRow key={i}>
                    <TableCell size="small">{new Date(currentDate.getTime() + (i + 7 - daysUntilMonday) * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                    <TableCell size="small">{columns[i]}</TableCell>
                    {day.map((hour, j) =>
                      <TableCell key={j}
                        size="small"
                        sx={{
                          backgroundColor: hour === 1 ? '#b90606' : '#90EE90',
                          textAlign: 'center',
                          fontSize: '10px'
                        }}>
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>}
          </Table>
        </TableContainer>
      </>
    )
};

export default AvailabilityTable;

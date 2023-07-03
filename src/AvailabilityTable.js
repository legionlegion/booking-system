import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AvailabilityTable = () => {
  const columns = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [rows, setRows] = useState(new Array(7).fill().map(() => new Array(24).fill(0)));
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const daysUntilMonday = (currentDayOfWeek + 6) % 7; // Days between current day and next Monday
  // Sunday is 6 days away, Monday is 0 days away, so that rows[0] is Mon and rows[6] is Sun

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`http://localhost:8080/`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let newRows = JSON.parse(JSON.stringify(rows));

        data.forEach(entry => {
          fillArray(entry.start_time, entry.end_time, newRows);
        });
        console.log("New rows: ", newRows);
        setRows(newRows);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  function fillArray(start, end, newRows) {
    let startDate = new Date(start);
    let endDate = new Date(end);

    // Get the starting and ending day and hour
    let startDay = (startDate.getDay() + 6) % 7; // Adjusted to have Mon as 0, Tues as 1 etc
    let startHour = startDate.getHours();

    // Get the difference in hours
    let diffInHours = (endDate - startDate) / (1000 * 60 * 60);
    console.log("Diff in hours: ", diffInHours);
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

  return (
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
        <TableBody>
          {rows.map((day, i) =>
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
      </Table>
    </TableContainer>
  );
};

export default AvailabilityTable;

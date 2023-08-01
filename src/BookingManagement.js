import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from './App';
import { Button, Grid } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const BookingManagement = () => {
  const [requestedbookings, setRequestedBookings] = useState([]);
  const [approvedbookings, setApprovedBookings] = useState([]);
  const [recurringBookings, setRecurringBookings] = useState([]);
  const { user } = useContext(UserContext);
  const [updated, setUpdated] = useState(false);

  const navigate = useNavigate();

  // Hook
  useEffect(() => {
    if (user.jwtToken === "") {
      navigate("/");
      return
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + user.jwtToken);
    headers.append("Username", user.username);

    const requestOptions = {
      method: "GET",
      headers: headers,
    }

    fetch(`${process.env.REACT_APP_BACKEND}/admin/booking-management`, requestOptions) // list of requested bookings by user or all users
      .then((response) => response.json())
      .then((data) => {
        console.log("All bookings: ", data)
        setApprovedBookings(data.approvedbookings)
        setRecurringBookings(data.recurringbookings)
        setRequestedBookings(data.requestedbookings)
        setUpdated(false);
      })
      .catch(err => {
        console.log(err);
      })
  }, [user.jwtToken, updated, navigate])

  const approveBooking = useCallback((booking) => {
    if (user.jwtToken === "") {
      navigate("/");
      return
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + user.jwtToken);

    let method = "PUT";

    const requestBody = booking;

    let requestOptions = {
      body: JSON.stringify(requestBody),
      method: method,
      headers: headers,
      credentials: "include",
    }

    fetch(`${process.env.REACT_APP_BACKEND}/admin/approve-booking`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message);
        }
        setUpdated(true);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  })

  const deleteBooking = useCallback((booking, type) => {
    if (user.jwtToken === "") {
      navigate("/");
      return
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + user.jwtToken);

    let method = "PUT";

    const requestBody = booking;

    let requestOptions = {
      body: JSON.stringify(requestBody),
      method: method,
      headers: headers,
      credentials: "include",
    }

    if (type == "pending") {
      fetch(`${process.env.REACT_APP_BACKEND}/admin/delete-pending`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setUpdated(true);
        })
        .catch(err => {
          console.log(err);
        })
    }

    if (type == "approved") {
      fetch(`${process.env.REACT_APP_BACKEND}/admin/delete-approved`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setUpdated(true);
        })
        .catch(err => {
          console.log(err);
        })
    }
  })

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <h3>Recurring Bookings</h3>
          <table className='table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Facility</th>
                <th>Purpose</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                recurringBookings ? recurringBookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.username}</td>
                    <td>{booking.name}</td>
                    <td>{booking.unit_number}</td>
                    <td>{new Date(booking.start_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td>{new Date(booking.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>{new Date(booking.end_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td>{new Date(booking.end_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>{booking.facility}</td>
                    <td>{booking.purpose}</td>
                    <td>
                      <Button variant="outlined" color="error" onClick={() => deleteBooking(booking, "approved")}>
                        <CloseIcon></CloseIcon>
                      </Button>
                    </td>
                  </tr>
                )) : null
              }
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12}>
          <h3>Existing Bookings</h3>
          <table className='table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Facility</th>
                <th>Purpose</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                approvedbookings ? approvedbookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.username}</td>
                    <td>{booking.name}</td>
                    <td>{booking.unit_number}</td>
                    <td>{new Date(booking.start_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td>{new Date(booking.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>{new Date(booking.end_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td>{new Date(booking.end_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>{booking.facility}</td>
                    <td>{booking.purpose}</td>
                    <td>
                      <Button variant="outlined" color="error" onClick={() => deleteBooking(booking, "approved")}>
                        <CloseIcon></CloseIcon>
                      </Button>
                    </td>
                  </tr>
                )) : null
              }
            </tbody>
          </table>
        </Grid>
        <Grid item xs={12}>
          <h3>Pending Bookings</h3>
          <table className='table'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Facility</th>
                <th>Purpose</th>
                <th>Recurring</th>
                <th>Recurring Weeks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                requestedbookings ? requestedbookings.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.username}</td>
                    <td>{booking.name}</td>
                    <td>{booking.unit_number}</td>
                    <td>{new Date(booking.start_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td>{new Date(booking.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>{new Date(booking.end_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td>{new Date(booking.end_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>{booking.facility}</td>
                    <td>{booking.purpose}</td>
                    <td>
                      {booking.recurring ? "Yes" : "No"}
                    </td>
                    <td>
                      {booking.recurring_weeks}
                    </td>
                    <td>
                      {user.isAdmin
                        ?
                        <Button variant="contained" color="success" onClick={() => approveBooking(booking)}>
                          <DoneIcon></DoneIcon>
                        </Button>
                        : null}
                      <Button variant="outlined" color="error" onClick={() => deleteBooking(booking, "pending")}>
                        <CloseIcon></CloseIcon>
                      </Button>
                    </td>
                  </tr>
                )) : null
              }
            </tbody>
          </table>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default BookingManagement;

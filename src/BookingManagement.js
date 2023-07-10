import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from './App';
import { Button, Grid } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const { user } = useContext(UserContext);
  const [updated, setUpdated] = useState(false);

  const navigate = useNavigate();

  // Hook
  useEffect(() => {
    console.log('isAdmin: ', user.isAdmin);
    if (user.jwtToken === "") {
      console.log("NO JWT TOKEN")
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

    fetch(`/admin/booking-management`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
        console.log("req bookings:", data)
        setUpdated(false);
      })
      .catch(err => {
        console.log(err);
      })

    if (user.isAdmin) {
      fetch(`/admin/all-booking`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setAllBookings(data);
          setUpdated(false);
          console.log("all bookings: ", data);
        })
        .catch(err => {
          console.log("ERR")
          console.log(err);
        })
    }
  }, [user.jwtToken, updated, navigate])

  const approveBooking = useCallback((booking) => {
    if (user.jwtToken === "") {
      console.log("NO JWT TOKEN")
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

    fetch(`/admin/approve-booking`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.message);
        }
        setUpdated(true);
        console.log("Approved: ", data);
      })
      .catch(err => {
        alert(err);
        console.log(err);
      })
  })

  const deleteBooking = useCallback((booking, type) => {
    if (user.jwtToken === "") {
      console.log("NO JWT TOKEN")
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
      fetch(`/admin/delete-pending`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setUpdated(true);
          console.log("Deleted: ", data);
        })
        .catch(err => {
          console.log(err);
        })
    }

    if (type == "approved") {
      fetch(`/admin/delete-approved`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setUpdated(true);
          console.log("Deleted: ", data);
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
                user.isAdmin && allBookings ? allBookings.map((booking, index) => (
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                bookings ? bookings.map((booking, index) => (
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

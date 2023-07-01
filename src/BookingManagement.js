import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from './App';
import { Button } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(UserContext);
  const [updated, setUpdated] = useState(false);

  const navigate = useNavigate();

  // Hook
  useEffect(() => {
    console.log('isAdmin: ', user.isAdmin); // undefined
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
        setUpdated(false);
        console.log("Bookings: ", data);
      })
      .catch(err => {
        console.log(err);
      })
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
        setUpdated(true);
        console.log("Approved: ", data);
      })
      .catch(err => {
        console.log(err);
      })
  })

  const deleteBooking = useCallback((booking) => {
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

    fetch(`/admin/delete-booking`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setUpdated(true);
        console.log("Deleted: ", data);
      })
      .catch(err => {
        console.log(err);
      })
  })

  return (
    <Fragment>
      <div className='bookings-container' style={{ margin: '15px' }}>
        <h3>Bookings</h3>
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
                    <Button variant="outlined" color="error" onClick={() => deleteBooking(booking)}>
                      <CloseIcon></CloseIcon>
                    </Button>
                  </td>
                </tr>
              )) : null
            }
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default BookingManagement;

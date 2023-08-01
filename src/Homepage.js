import React, { Fragment, useContext, useEffect, useState } from 'react';
import AvailabilityTable from './AvailabilityTable';
import BookingForm from './BookingForm';
import { UserContext } from './App';

// functional component (instead of using the  traditional class method)
function Homepage() {
  const { user } = useContext(UserContext);

  useEffect(() => {
  }, [])

  return (
    <Fragment>
      <div style={{ margin: '15px' }}>
      </div>
      <AvailabilityTable></AvailabilityTable>
      <hr />
      {user.jwtToken !== "" && (<BookingForm></BookingForm>)}
    </Fragment>
  )
}

export default Homepage;
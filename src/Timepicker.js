import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { forwardRef } from "react";

const TimePicker = forwardRef((props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker
        label={props.title}
        views={['hours']}
        className='form-control mb-3'
        onChange={props.onChange}
        slotProps={{
          textField: {
            error: props.error,
            helperText: props.error ? props.helperText : ""
          },
        }}
      />
    </LocalizationProvider>
  );
});

export default TimePicker;
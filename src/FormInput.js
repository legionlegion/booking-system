import React from "react";
import { TextField } from "@mui/material";


const FormInput = ({ title, type, id, autoComplete, value, error, errorMessage, onChange }) => {
  return (
    <div className='mb-3'>
      <label className='form-label' htmlFor={id}>{title}</label>
      <TextField
        variant="outlined"
        type={type}
        id={id}
        name={id}
        autoComplete={autoComplete}
        onChange={onChange}
        value={value}
        error={error}
        helperText={error ? errorMessage : null}
        fullWidth
      />
    </div>
  );
};

export default FormInput;
import React, { useContext, useState } from "react";
import FormInput from "./FormInput";
import TimePicker from "./Timepicker";
import dayjs from 'dayjs';
import { Grid, TextField } from '@mui/material';
import { Input } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserContext } from "./App";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = (newName, newStartDate, newEndDate, newUnitNumber, newStartTime, newEndTime, newPurpose) => {
        // Create Date objects from your inputs
        let startDate = new Date(newStartDate);
        let startTime = new Date(newStartTime);
        let endDate = new Date(newEndDate);
        let endTime = new Date(newEndTime);

        // Extract the hours and minutes from the time field
        let startHour = startTime.getHours();
        let startMinute = startTime.getMinutes();
        let endHour = endTime.getHours();
        let endMinute = endTime.getMinutes();

        // Set the hours and minutes of the date object
        startDate.setHours(startHour);
        startDate.setMinutes(startMinute);
        endDate.setHours(endHour);
        endDate.setMinutes(endMinute);

        let formattedStartDate = startDate.toISOString();
        let formattedEndDate = endDate.toISOString();
        let formattedStartDateWithoutMs = formattedStartDate.slice(0, -5) + 'Z'; // remove milliseconds
        let formattedEndDateWithoutMs = formattedEndDate.slice(0, -5) + 'Z'; // remove milliseconds

        let newBooking = {
            name: newName,
            start_date: newStartDate,
            end_date: newEndDate,
            unit_number: newUnitNumber,
            start_time: formattedStartDateWithoutMs,
            end_time: formattedEndDateWithoutMs,
            purpose: newPurpose,
            username: user.username,
            facility: "MPSH",
        }

        console.log("New booking: ", newBooking);
        // validation passed, submit
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + user.jwtToken);

        // adding movie
        let method = "PUT";

        const requestBody = newBooking;

        let requestOptions = {
            body: JSON.stringify(requestBody),
            method: method,
            headers: headers,
            credentials: "include",
        }

        fetch(`/admin/add-booking`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log("Err: ", data)
                    alert(data.message);
                } else {
                    navigate("/")
                }
            })
            .catch(err => {
                alert("Error: " + err);
                console.log(err);
            })
    }

    const [formValues, setFormValues] = useState({
        name: {
            value: "",
            error: false,
            errorMessage: "You must enter a name"
        },
        unitNumber: {
            value: "",
            error: false,
            errorMessage: "You must enter a unit number"
        },
        startDate: {
            value: "",
            error: false,
            errorMessage: "You must select a start date"
        },
        startTime: {
            value: "",
            error: false,
            errorMessage: "You must select a start time"
        },
        endDate: {
            value: "",
            error: false,
            errorMessage: "You must select an end date"
        },
        endTime: {
            value: "",
            error: false,
            errorMessage: "You must select an end time"
        },
        purpose: {
            value: "",
            error: false,
            errorMessage: "You must state a purpose"
        }
    });

    const handleChange = (e, field) => {
        let value;
        if (field === "startTime" || field === "endTime") {
            // let date = new Date(e.$d);
            // console.log("Start/end time: ", e);
            // let isoDate = date.toISOString();
            // let formattedDate = isoDate.slice(0, -5) + 'Z'; // remove miliseconds
            // console.log("DATE: ", formattedDate);
            value = e.format('YYYY-MM-DDTHH:mm:ssZ');
        } else if (field === "startDate" || field === "endDate") {
            value = e.format('YYYY-MM-DDTHH:mm:ssZ');
        } else {
            value = e.target.value;
        }
        console.log("value: ", value)
        setFormValues({
            ...formValues,
            [field]: {
                ...formValues[field],
                value: value,
                error: value ? false : true,
            }
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let isError = false;
        let newFormValues = { ...formValues };

        Object.keys(formValues).forEach((key) => {
            const field = formValues[key];
            if (!field.value) {
                newFormValues[key].error = true;
                isError = true;
            }
        });
        if (!isError) {
            handleSubmit(formValues.name.value, formValues.startDate.value, formValues.endDate.value,
                formValues.unitNumber.value, formValues.startTime.value, formValues.endTime.value, formValues.purpose.value);
        }
    };


    return (
        <form autoComplete='off' onSubmit={handleFormSubmit}>
            <FormInput
                title="Name"
                type="text"
                id="name"
                autoComplete="name"
                value={formValues.name.value}
                error={formValues.name.error}
                errorMessage={formValues.name.errorMessage}
                onChange={(e) => handleChange(e, 'name')}
            >
            </FormInput>
            <FormInput
                title="Unit Number"
                type="text"
                id="unit-number"
                autoComplete="unit-number"
                value={formValues.unitNumber.value}
                error={formValues.unitNumber.error}
                errorMessage={formValues.unitNumber.errorMessage}
                onChange={(e) => handleChange(e, 'unitNumber')}
            >
            </FormInput>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Start date of requested booking"
                            value={formValues.startDate.value}
                            onChange={(e) => handleChange(e, 'startDate')}
                            error={formValues.startDate.error}
                            helperText={formValues.startDate.errorMessage}
                            renderInput={(params) => <TextField {...params} fullWidth autoComplete="off" />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="Start Time"
                            value={formValues.startTime.value}
                            onChange={(e) => handleChange(e, 'startTime')}
                            error={formValues.startTime.error}
                            helperText={formValues.startTime.errorMessage}
                            renderInput={(params) => <TextField {...params} fullWidth autoComplete="off" />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="End date of requested booking"
                            value={formValues.endDate.value}
                            onChange={(e) => handleChange(e, 'endDate')}
                            error={formValues.endDate.error}
                            helperText={formValues.endDate.errorMessage}
                            renderInput={(params) => <TextField {...params} fullWidth autoComplete="off" />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            label="End Time"
                            value={formValues.endTime.value}
                            onChange={(e) => handleChange(e, 'endTime')}
                            error={formValues.endTime.error}
                            helperText={formValues.endTime.errorMessage}
                            renderInput={(params) => <TextField {...params} fullWidth autoComplete="off" />}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <FormInput
                title="Purpose"
                type="text"
                id="purpose"
                autoComplete="purpose"
                value={formValues.purpose.value}
                error={formValues.purpose.error}
                errorMessage={formValues.purpose.errorMessage}
                onChange={(e) => handleChange(e, 'purpose')}
            >
            </FormInput>

            <Input type="submit" value="Submit" className="btn btn-primary mb-3"></Input>
        </form>
    );
};

export default BookingForm;
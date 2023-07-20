import React, { useContext, useState } from "react";
import FormInput from "./FormInput";
import TimePicker from "./Timepicker";
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { Input } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserContext } from "./App";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = (newName, newStartDate, newEndDate, newUnitNumber, newStartTime, newEndTime, newPurpose) => {
        // Create Date objects from inputs
        let startDate = new Date(newStartDate);
        let startTime = new Date(newStartTime);
        let endDate = new Date(newEndDate);
        let endTime = new Date(newEndTime);
        let startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T00:00:00Z`;
        let endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T00:00:00Z`;


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
            start_date: startDateString,
            end_date: endDateString,
            unit_number: newUnitNumber,
            start_time: formattedStartDateWithoutMs,
            end_time: formattedEndDateWithoutMs,
            purpose: newPurpose,
            username: user.username,
            facility: "MPSH",
        }

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

        fetch(`${process.env.REACT_APP_BACKEND}/admin/add-booking`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.message);
                } else {
                    alert("Booking submitted!");
                    navigate("/booking-management")
                }
            })
            .catch(err => {
                alert("Error: " + err);
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
            value: null,
            error: false,
            errorMessage: "You must select a start date"
        },
        startTime: {
            value: "",
            error: false,
            errorMessage: "You must select a start time"
        },
        endDate: {
            value: null,
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
        let error = false;
        let errorMessage = "";

        if (field === "startTime" || field === "endTime" || field === "startDate" || field === "endDate") {
            value = e;
            if (e) {
                if (field === "startTime" && formValues.endTime.value && dayjs(e).isAfter(dayjs(formValues.endTime.value))) {
                    error = true;
                    errorMessage = "Start time cannot be later than end time!";
                }
                if (field === "startDate" && formValues.endDate.value && dayjs(e).isAfter(dayjs(formValues.endDate.value))) {
                    error = true;
                    errorMessage = "Start date cannot be later than end date!";
                }
                if (field === "endTime" && formValues.startTime.value && dayjs(e).isBefore(dayjs(formValues.startTime.value))) {
                    error = true;
                    errorMessage = "End time cannot be earlier than start time!";
                }
                if (field === "endDate" && formValues.startDate.value && dayjs(e).isBefore(dayjs(formValues.startDate.value))) {
                    error = true;
                    errorMessage = "End date cannot be earlier than start date!";
                }
            } else {
                error = true;
                errorMessage = formValues[field].errorMessage;
            }
        } else {
            if (field === "unitNumber" && e.target.value.length > 4) {
                return; // don't update the value if the length is more than 4
            }
            value = e.target.value;
            if (!value) {
                error = true;
                errorMessage = formValues[field].errorMessage;
            }
        }

        let newFormValues = {
            ...formValues,
            [field]: {
                value: value,
                error: error,
                errorMessage: errorMessage == "" ? formValues[field].errorMessage : errorMessage
            }
        };

        setFormValues(newFormValues);
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
        setFormValues(newFormValues);
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
                limit={20}
            >
            </FormInput>
            <FormInput
                title="Unit Number"
                type="number"
                id="unit-number"
                autoComplete="unit-number"
                value={formValues.unitNumber.value}
                error={formValues.unitNumber.error}
                errorMessage={formValues.unitNumber.errorMessage}
                onChange={(e) => handleChange(e, 'unitNumber')}
                limit={4}
            >
            </FormInput>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            open={openStart}
                            onOpen={() => setOpenStart(true)}
                            onClose={() => setOpenStart(false)}
                            label="Start date"
                            value={formValues.startDate.value}
                            onChange={(e) => handleChange(e, 'startDate')}
                            disablePast
                            slotProps={{
                                textField: {
                                    error: formValues.startDate.error,
                                    helperText: formValues.startDate.error ? formValues.startDate.errorMessage : "",
                                    readOnly: true,
                                    onClick: (e) => setOpenStart(true)
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            title="Start Time"
                            value={formValues.startTime.value}
                            onChange={(e) => handleChange(e, 'startTime')}
                            error={formValues.startTime.error}
                            helperText={formValues.startTime.errorMessage}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            open={openEnd}
                            onOpen={() => setOpenEnd(true)}
                            onClose={() => setOpenEnd(false)}
                            label="End date"
                            value={formValues.endDate.value}
                            onChange={(e) => handleChange(e, 'endDate')}
                            disablePast
                            slotProps={{
                                textField: {
                                    error: formValues.endDate.error,
                                    helperText: formValues.endDate.error ? formValues.endDate.errorMessage : "",
                                    readOnly: true,
                                    onClick: (e) => setOpenEnd(true)
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            title="End Time"
                            value={formValues.endTime.value}
                            onChange={(e) => handleChange(e, 'endTime')}
                            error={formValues.endTime.error}
                            helperText={formValues.endTime.errorMessage}
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
                limit={100}
            >
            </FormInput>

            <Input type="submit" value="Submit" className="btn btn-primary mb-3"></Input>
        </form>
    );
};

export default BookingForm;
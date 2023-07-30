import React, { useContext, useState, useEffect } from 'react';
import FormInput from "./FormInput";
import TimePicker from "./Timepicker";
import dayjs from 'dayjs';
import { Grid, TextField } from '@mui/material';
import { Input } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserContext } from "./App";
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import { FormControl, InputLabel, FormHelperText } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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
        unitLevel: {
            value: "",
            error: false,
            errorMessage: "You must enter a level"
        },
        unitRoom: {
            value: "",
            error: false,
            errorMessage: "You must enter a room number"
        },
        unitLetter: {
            value: "",
            error: false,
            errorMessage: "You must enter a letter"
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
                if (field === "startTime" && formValues.endTime.value && dayjs(e).isAfter(dayjs(formValues.endTime.value))
                    && !dayjs(formValues.endDate.value).isAfter(dayjs(formValues.startDate.value))) {
                    error = true;
                    errorMessage = "Start time cannot be later than end time!";
                }
                if (field === "startDate" && formValues.endDate.value && dayjs(e).isAfter(dayjs(formValues.endDate.value))) {
                    error = true;
                    errorMessage = "Start date cannot be later than end date!";
                }
                if (field === "endTime" && formValues.startTime.value && dayjs(e).isBefore(dayjs(formValues.startTime.value))
                    && !dayjs(formValues.endDate.value).isAfter(dayjs(formValues.startDate.value))) {
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

    useEffect(() => {
        // Update errors based on formValues.unitRoom and formValues.unitLetter values
        const newFormValues = {...formValues}; // Make a copy of formValues state
    
        if (formValues.unitRoom.value === '01' || formValues.unitRoom.value === '11' || formValues.unitRoom.value === '12') {
            // Check if unitLetter has a value
            if (!formValues.unitLetter.value) {
                newFormValues.unitLetter.error = true;
                newFormValues.unitLetter.errorMessage = 'Letter is required';
            } else {
                newFormValues.unitLetter.error = false;
                newFormValues.unitLetter.errorMessage = '';
            }
        } else {
            // Clear error for unitLetter if unitRoom is not '01', '11' or '12'
            newFormValues.unitLetter.error = false;
            newFormValues.unitLetter.errorMessage = '';
            newFormValues.unitLetter.value = '';  // Reset unitLetter value to empty
        }
    
        setFormValues(newFormValues);
    }, [formValues.unitRoom.value, formValues.unitLetter.value]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let isError = false;
        let newFormValues = { ...formValues };

        Object.keys(formValues).forEach((key) => {
                    // Skip validation for unitLetter if room number is not '01', '11', or '12'
            if (key === 'unitLetter' && !['01', '11', '12'].includes(formValues.unitRoom.value)) {
                return;
            }

            const field = formValues[key];
            if (!field.value) {
                newFormValues[key].error = true;
                isError = true;
            }
        });
        setFormValues(newFormValues);
        if (!isError) {
            // Combine the unit level, room, and letter into one string
            let newUnitNumber = `#${formValues.unitLevel.value}-${formValues.unitRoom.value}`;
            if(formValues.unitLetter.value) {
                newUnitNumber += formValues.unitLetter.value;
            }
            
            handleSubmit(formValues.name.value,
                         formValues.startDate.value,
                         formValues.endDate.value,
                         newUnitNumber,
                         formValues.startTime.value,
                         formValues.endTime.value,
                         formValues.purpose.value);
        }
    };

    return (
        <form autoComplete='off' onSubmit={handleFormSubmit} data-testid='booking-form'>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        id="name"
                        type="text"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={formValues.name.value}
                        error={Boolean(formValues.name.error)}
                        helperText={formValues.name.error ? formValues.name.errorMessage : ""}
                        onChange={(e) => handleChange(e, 'name')}
                        autoComplete="name"
                        inputProps={{ maxLength: 20 }}
                        data-testid='name-field'                       
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth error={formValues.purpose.error}>
                        <InputLabel>Purpose</InputLabel>
                        <Select
                            label="Purpose"
                            id="purpose"
                            value={formValues.purpose.value}
                            onChange={(e) => handleChange(e, 'purpose')}
                            autoComplete="purpose"
                            data-testid='purpose-field'
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {['Personal', 'Ulti', 'Badminton', 'Dodgeball', 'Spikeball', 'Table Tennis', 'Tembu Netball', 'R4D', 'Captains Ball', 'Floorball', 'Netball', 'Tchoukball', 'Basketball (W)', 'Basketball (M)'].map((purpose) => (
                                <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
                            ))}
                        </Select>
                        {formValues.purpose.error && 
                        <FormHelperText>{formValues.purpose.errorMessage}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: '1px'}}>
                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth error={formValues.unitLevel.error}>
                        <InputLabel>Unit Level</InputLabel>
                        <Select
                            label="Unit Level"
                            value={formValues.unitLevel.value}
                            onChange={(e) => handleChange(e, 'unitLevel')}
                            data-testid='unitlevel-field'
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {Array.from({ length: 15 }, (_, i) => i + 3).map((level) => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                            ))}
                        </Select>
                        {formValues.unitLevel.error && 
                        <FormHelperText>{formValues.unitLevel.errorMessage}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="outlined"  fullWidth error={formValues.unitRoom.error}>
                        <InputLabel>Unit Room</InputLabel>
                        <Select 
                            label="Unit Room"
                            value={formValues.unitRoom.value} 
                            onChange={(e) => handleChange(e, 'unitRoom')}
                            error={formValues.unitRoom.error}
                            data-testid='unitroom-field'
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {Array.from({ length: 27 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((room) => (
                                <MenuItem key={room} value={room}>{room}</MenuItem>
                            ))}
                        </Select>
                        {formValues.unitRoom.error && 
                        <FormHelperText>{formValues.unitRoom.errorMessage}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth disabled={formValues.unitRoom.value !== '01' && formValues.unitRoom.value !== '11' && formValues.unitRoom.value !== '12'}
                    error={formValues.unitLetter.error && (formValues.unitRoom.value === '01' || formValues.unitRoom.value === '11' || formValues.unitRoom.value === '12')}
                    >
                        <InputLabel>Letter</InputLabel>
                        <Select 
                            label="Letter"
                            value={formValues.unitLetter.value} 
                            onChange={(e) => handleChange(e, 'unitLetter')}
                            error={formValues.unitLetter.error}
                            data-testid='unitletter-field'
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => (
                                <MenuItem key={letter} value={letter}>{letter}</MenuItem>
                            ))}
                        </Select>
                        {formValues.unitLetter.error && (formValues.unitRoom.value === '01' || formValues.unitRoom.value === '11' || formValues.unitRoom.value === '12') && 
                        <FormHelperText>{formValues.unitLetter.errorMessage}</FormHelperText>}
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginTop: '1px'}}>
                <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            open={openStart}
                            onOpen={() => setOpenStart(true)}
                            onClose={() => setOpenStart(false)}
                            label="Start date"
                            data-testid='startdate-field'
                            value={formValues.startDate.value}
                            onChange={(e) => handleChange(e, 'startDate')}
                            disablePast
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    error: formValues.startDate.error,
                                    helperText: formValues.startDate.error ? formValues.startDate.errorMessage : "",
                                    readOnly: false, // Allow user interaction
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
                        sx={{ width: '100%' }}
                        error={formValues.startTime.error}
                        helperText={formValues.startTime.errorMessage}
                        renderInput={(params) => <TextField {...params} label="Start Time" />}
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
                            data-testid='enddate-field'
                            value={formValues.endDate.value}
                            onChange={(e) => handleChange(e, 'endDate')}
                            disablePast
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    error: formValues.endDate.error,
                                    helperText: formValues.endDate.error ? formValues.endDate.errorMessage : "",
                                    readOnly: false, // Allow user interaction
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
                            data-testid='endtime-field'
                            value={formValues.endTime.value}
                            onChange={(e) => handleChange(e, 'endTime')}
                            sx={{ width: '100%' }}
                            error={formValues.endTime.error}
                            helperText={formValues.endTime.errorMessage}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Input type="submit" value="Submit" className="btn btn-primary mb-3"></Input>
        </form>
    );
};

export default BookingForm;
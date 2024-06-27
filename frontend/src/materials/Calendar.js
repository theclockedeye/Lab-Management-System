import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CheckIcon from "@mui/icons-material/Check";

function Calendar({ onDateSelect }) {
  const [value, setValue] = useState(new Date());
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 13]);

  const pickerStyle = {
    backgroundColor: "orange", // Set the background color to orange
  };

  const handleDateChange = (newValue) => {
    console.log("Selected Date:", newValue);
    setValue(newValue);
    // Call the onDateSelect function with the selected date
    onDateSelect(newValue);
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          variant="static"
          orientation="portrait"
          value={value}
          disableFuture
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Badge
                    overlap="circular"
                    badgeContent={<CheckIcon color="error" />}
                  >
                    {params.InputProps.endAdornment}
                  </Badge>
                ),
              }}
            />
          )}
          renderDay={(day, _value, DayComponentProps) => {
            const isSelected =
              !DayComponentProps.outsideCurrentMonth &&
              highlightedDays.indexOf(day.getDate()) >= 0;
            return (
              <Badge
                key={day.toString()}
                overlap="circular"
                badgeContent={
                  isSelected ? <CheckIcon color="error" /> : undefined
                }
              >
                <PickersDay {...DayComponentProps} />
              </Badge>
            );
          }}
          PaperProps={{
            style: pickerStyle, // Apply the style object to the top area
          }}
        />
      </LocalizationProvider>
    </div>
  );
}

export default Calendar;

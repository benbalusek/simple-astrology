"use client";

import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

export default function DateSelector({
  value,
  onChange,
}: {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={value}
        onChange={onChange}
        sx={{
          backgroundColor: "rgb(247, 236, 207)",
          borderRadius: "0.5rem",
          "& .MuiSvgIcon-root": {
            color: "rgb(19, 36, 68)",
          },
        }}
      />
    </LocalizationProvider>
  );
}

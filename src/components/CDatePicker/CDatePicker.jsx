import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const today = dayjs();
// const yesterday = dayjs().subtract(0, 'day');
const todayStartOfTheDay = today.startOf('day');

export default function DateValidationDisablePast(props) {
  // console.log(props.date);
  const [defaultDate, setDefaultDate] = React.useState(dayjs(props.date, 'YYYY/MM/DD'));
  const handleDateChange = (date) => {
    setDefaultDate(date);
    let formatedDate = `${date.$y}-${(date.$M + 1).toString().padStart(2, '0')}-${date.$D.toString().padStart(2, '0')}`;
    props.setDate(formatedDate);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DemoItem label={props.label}>
          <DatePicker
            sx={{ width: props.width ? props.width : 300 }}
            value={defaultDate}
            onChange={handleDateChange}
            defaultValue={defaultDate}
            disablePast={todayStartOfTheDay < defaultDate ? true : false}
            views={['year', 'month', 'day', 'hours', 'minutes']}
            readOnly
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}

import React, {  useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import CSelect from '../CSelect/CSelect';
import { createJob } from '../../feature/jobSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { validateInput } from '../../utils/validateInput';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';

const AddJob = (props) => {
  const dispatch = useDispatch();
  const [jobName, setJobName] = useState('');
  const [jobDescription, setjobDescription] = useState('');
  const [jobStatus, setjobStatus] = useState('');
  const [jobStartDate, setJobStartDate] = useState(dayjs(Date.now()));
  const [jobEndDate, setJobEndDate] = useState('');
  const selectData = [
    { name: 'Priority', value: 'priority' },
    { name: 'Completed', value: 'completed' },
    { name: 'In Process', value: 'in_process' },
  ];

  const handleSubmit = () => {
    //Validate Role
    if (!validateInput('jobName', jobName)) {
      return;
    }
    if (!validateInput('jobStatus', jobStatus)) {
      return;
    }
    const jobData = {
      name: jobName,
      description: jobDescription,
      status: jobStatus,
      startDate: jobStartDate.toISOString(),
      endDate: jobEndDate ? jobEndDate.toISOString() : '',
    };

    dispatch(createJob(jobData)).then((res) => {
      if (res.type === 'createJob/jobs/fulfilled') {
        const { message } = res.payload;
        showSuccessToast(message);
        props.setOpen(false);
      }

      if (res.type === 'createJob/jobs/rejected') {
        const { message } = res.error;
        showErrorToast(message);
      }
    });
  };
  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#2065D1',
          borderRadius: 10,
          color: 'white',
          marginBottom: '20px',
        }}
      >
        <p>Add Job</p>
      </div>
      <div>
        <CTextField
          margin="5px 0px"
          onChange={(event) => {
            setJobName(event.target.value);
          }}
          name="name"
          label="Name"
          required={true}
        />
        <CTextField
          margin="5px 0px"
          onChange={(event) => {
            setjobDescription(event.target.value);
          }}
          name="description"
          label="Description"
        />
        <CSelect
          margin="5px 0px"
          label="Select Status"
          data={selectData}
          initialValue={jobStatus}
          setinitialValue={setjobStatus}
          padding="0px"
        />
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                <DatePicker
                  label="Start Date"
                  value={jobStartDate}
                  onChange={(newValue) => setJobStartDate(newValue)}
                />
                <DatePicker label="End Date" value={jobEndDate} onChange={(newValue) => setJobEndDate(newValue)} />
              </div>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <Button
          disabled={props.isLoading}
          onClick={handleSubmit}
          variant="outlined"
          sx={{ width: '100%', margin: '10px 0px 0px 0px' }}
        >
          {props.isLoading ? 'Loading..' : ' Submit'}
        </Button>
      </div>
    </div>
  );
};

export default AddJob;

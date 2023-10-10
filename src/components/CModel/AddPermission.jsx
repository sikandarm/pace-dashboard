import React, { useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import CSwitch from '../CSwitch/CSwitch';
import { createPermission } from '../../feature/permissionsSlice';
import { toast } from 'react-toastify';

const AddPermission = (props) => {
  const dispatch = useDispatch();
  const [isActive, setActive] = useState(false);
  const [data, setData] = useState({
    name: '',
  });

  const handleChange = (event) => {
    setData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };
  // const handleSwitchChange = (event) => {
  //   // Handle the change event here
  //   setActive(event.target.checked);
  // };
  const handleSubmit = () => {
    let finalData = { ...data, isActive };
    dispatch(createPermission(finalData)).then((res) => {
      if (res.type === 'createPermission/permissions/fulfilled') {
        toast('Permission created successfully!');
        props.setOpen(false);
      }
    });
  };
  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px 15px',
          justifyContent: 'space-between',
          background: '#2065D1',
          borderRadius: 10,
          color: 'white',
          marginBottom: '20px',
        }}
      >
        <p>Add Permission</p>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          Active <CSwitch label="Active" active={isActive} setSwitch={() => setActive(!isActive)} />
        </span>
      </div>
      <div>
        <CTextField onChange={handleChange} name="name" label="Permission" />
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

export default AddPermission;

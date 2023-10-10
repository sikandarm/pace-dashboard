import React, { useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import {  updateUser } from '../../feature/userSlice';
import CSwitch from '../CSwitch/CSwitch';
import { toast } from 'react-toastify';
const UserUpdate = (props) => {
  const { id, firstName, lastName,  email, phone } = props.data;
  const dispatch = useDispatch();
  const [data, setData] = useState({
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
  });
  // console.log(props);
  const [isActive, setActive] = useState(props.data.isActive);
  // const handleSwitchChange = (event) => {
  //   // Handle the change event here
  //   setActive(event.target.checked);
  // };
  const handleChange = (event) => {
    setData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };

  const handleSubmit = () => {
    const finalData = { ...data, isActive };
    dispatch(updateUser(finalData)).then((res) => {
      if (res.type === 'update-users/users/rejected') {
        console.log(res);
        toast(res.payload);
        // props.setOpen(false);
      }
      if (res && res.payload.id) {
        toast('User Updated Successfully !');
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
          padding: '0px 10px',
          justifyContent: 'space-between',
          background: '#2065D1',
          borderRadius: 10,
          color: 'white',
          marginBottom: '20px',
        }}
      >
        <p>Update User</p>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          Active <CSwitch label="Active" active={isActive} setSwitch={() => setActive(!isActive)} />
        </span>
      </div>
      <div>
        <CTextField
          margin="5px 0px"
          onChange={handleChange}
          defaultValue={firstName}
          name="firstName"
          label="First Name"
        />
        <CTextField margin="5px 0px" onChange={handleChange} defaultValue={email} name="email" label="Email" />
        {/* <CTextField onChange={handleChange} defaultValue name="password" label="Passwors" /> */}
        {/* <CTextField onChange={handleChange} defaultValue={roleId} name="roleId" label="Role Id" /> */}
        <CTextField margin="5px 0px" onChange={handleChange} defaultValue={phone} name="phone" label="Phone" />
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

export default UserUpdate;

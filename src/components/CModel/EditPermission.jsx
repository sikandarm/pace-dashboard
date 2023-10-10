import React, { useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updatePermission } from '../../feature/permissionsSlice';
import CSwitch from '../CSwitch/CSwitch';
import { toast } from 'react-toastify';

const EditPermission = (props) => {
  const { id, name } = props.data;
  const dispatch = useDispatch();
  const [isActive, setActive] = useState(props.data.isActive);
  const [data, setData] = useState({
    id: id,
    name: name,
    roleId: id,
  });

  const handleChange = (event) => {
    setData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };
  // const handleSwitchChange = (event) => {
  //   // Handle the change event here
  //   setActive(event.target.checked);
  // };
  const handleSubmit = () => {
    let fd = { ...data, isActive };
    console.log(fd);
    dispatch(updatePermission(fd)).then((res) => {
      if (res.type === 'updatePermissions/permissions/fulfilled') {
        toast('Permission Updated successfully !');
        props.setOpen(false);
      }
    });
  };
  // console.log(props.data);
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
        <p>Update Permission</p>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          Active <CSwitch label="Active" active={isActive} setSwitch={() => setActive(!isActive)} />
        </span>
      </div>
      <div>
        {/* <CTextField onChange={handleChange} defaultValue={firstName} name="firstName" label="First Name" />
        <CTextField onChange={handleChange} defaultValue={lastName} name="lastName" label="Last Name" />
        <CTextField onChange={handleChange} defaultValue={email} name="email" label="Email" /> */}
        <CTextField onChange={handleChange} defaultValue={name} name="name" label="Name" />
        {/* <CTextField onChange={handleChange} defaultValue={id} name="roleId" label="Role Id" /> */}
        {/* <CTextField onChange={handleChange} defaultValue={phone} name="phone" label="Phone" /> */}
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

export default EditPermission;

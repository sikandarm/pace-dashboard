import { useEffect, useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CMultiSelect from '../CMutiSelect/CMultiSelect';
import { getPermission } from '../../feature/permissionsSlice';
import { createRole } from '../../feature/roleSlice';
import { toast } from 'react-toastify';
import CSwitch from '../CSwitch/CSwitch';

const AddRole = (props) => {
  const dispatch = useDispatch();
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const { permissions } = useSelector((state) => state.permissionSlice);
  const handleChange = (event) => {
    setRoleName(event.target.value);
  };

  const handleSubmit = () => {
    if (roleName === '') return toast('Please Enter Role name');
    const data = { name: roleName, permissions: selectedPermissions, isNotification: notificationEnabled };
    dispatch(createRole(data)).then((res) => {
      if (res.type === 'createRole/roles/fulfilled') {
        toast('Role Created Successfully !');
        props.setOpen(false);
      }
    });
  };

  useEffect(() => {
    if (permissions.length === 0) {
      dispatch(getPermission());
    }
  }, [dispatch, permissions.length]);
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
        <p>Add Role</p>
      </div>
      <div>
        <CTextField onChange={handleChange} name="name" label="Role" required={true} />
        <div style={{ margin: '20px 0px' }}>
          <CMultiSelect
            data={permissions}
            permission={selectedPermissions}
            selectedPermissions={setSelectedPermissions}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Notification:</span>
          <CSwitch
            active={notificationEnabled}
            name="orderArrivedInFull"
            setSwitch={() => setNotificationEnabled(!notificationEnabled)}
          />
        </div>

        <Button onClick={handleSubmit} variant="outlined" sx={{ width: '100%', margin: '10px 0px 0px 0px' }}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddRole;

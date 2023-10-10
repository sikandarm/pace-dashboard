import { useState } from 'react';
import CTextField from '../CTextField/CTextField';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateRole } from '../../feature/roleSlice';
import CMultiSelect from '../CMutiSelect/CMultiSelect';
import { toast } from 'react-toastify';
import CSwitch from '../CSwitch/CSwitch';

const EditRole = (props) => {
  const { id, name, permissions, isNotification } = props.data;
  const dispatch = useDispatch();
  let rolePermissions = permissions ? permissions.map((item) => item.id) : '';
  const [selectedPermissions, setSelectedPermissions] = useState(rolePermissions);
  const [notificationEnabled, setNotificationEnabled] = useState(isNotification);
  const [data, setData] = useState({
    roleId: id,
    name,
    isNotification,
  });

  const handleChange = (event) => {
    setData((prv) => ({ ...prv, [event.target.name]: event.target.value }));
  };

  const handleSubmit = () => {
    dispatch(updateRole({ ...data, permissions: selectedPermissions, isNotification: notificationEnabled })).then(
      (res) => {
        if (res.type === 'updateRoles/roles/fulfilled') {
          props.setOpen(false);
          toast('Role Updated Successfully !');
        }
      }
    );
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
        <p>Update Role</p>
      </div>
      <div>
        <CTextField onChange={handleChange} defaultValue={name} name="name" label="Role" />
        <div style={{ margin: '20px 0px' }}>
          <CMultiSelect
            data={props.permissions}
            permission={props.data.permissions}
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

export default EditRole;

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import AddPermission from './AddPermission';
import AddRole from './AddRole';
import EditRole from './EditRole';
import EditPermission from './EditPermission';
import AddInventory from './AddInventory';
import EditInventory from './EditInventory';
import AddJob from './AddJob';
import EditJob from './EditJob';
import AddTask from './AddTask';
import EditTask from './EditTask';
import ConformationModel from './ConformationModel';

export default function CModel(props) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:
      props.filter === 'update-inventory' ||
      props.filter === 'add-inventory' ||
      props.filter === 'add-task' ||
      props.filter === 'edit-task'
        ? 700
        : 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
  };
  //   const [open, setOpen] = React.useState(false);
  // const handleOpen = () => props.setOpen(true);
  const handleClose = () => props.setOpen(false);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={props.open}>
        <Box sx={style}>
          {props.filter === 'add-permission' ? (
            <AddPermission setOpen={props.setOpen} isLoading={props.isLoading} />
          ) : props.filter === 'edit-permission' ? (
            <EditPermission data={props.data} setOpen={props.setOpen} isLoading={props.isLoading} />
          ) : props.filter === 'add-role' ? (
            <AddRole setOpen={props.setOpen} data={props.data} />
          ) : props.filter === 'update-role' ? (
            <EditRole setOpen={props.setOpen} permissions={props.permissions} data={props.data} />
          ) : props.filter === 'add-inventory' ? (
            <AddInventory
              setOpen={props.setOpen}
              permissions={props.permissions}
              isLoading={props.isLoading}
              data={props.data}
            />
          ) : props.filter === 'update-inventory' ? (
            <EditInventory setOpen={props.setOpen} data={props.data} isLoading={props.isLoading} />
          ) : props.filter === 'add-job' ? (
            <AddJob setOpen={props.setOpen} data={props.data} isLoading={props.isLoading} />
          ) : props.filter === 'edit-job' ? (
            <EditJob setOpen={props.setOpen} data={props.data} isLoading={props.isLoading} />
          ) : props.filter === 'add-task' ? (
            <AddTask
              users={props.users}
              setOpen={props.setOpen}
              jobs={props.jobs}
              data={props.data}
              isLoading={props.isLoading}
            />
          ) : props.filter === 'edit-task' ? (
            <EditTask
              users={props.users}
              setOpen={props.setOpen}
              jobs={props.jobs}
              data={props.data}
              isLoading={props.isLoading}
              reasons={props.reasons}
            />
          ) : props.filter === 'conformation' ? (
            <ConformationModel
              handleClick={props.handleClick}
              title="Are you Sure?"
              setOpen={props.setOpen}
              // jobs={props.jobs}
              // data={props.data}
              isLoading={props.isLoading}
              // reasons={props.reasons}
            />
          ) : (
            ''
          )}
        </Box>
      </Fade>
    </Modal>
  );
}

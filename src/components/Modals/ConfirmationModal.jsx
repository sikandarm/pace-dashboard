import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          boxShadow: 24,
          p: 4,
          width: 400, // Adjust the width as needed
          textAlign: 'center',
          borderRadius: '20px',
        }}
      >
        <Typography variant="h5">Are you sure you want to delete?</Typography>
        <Button sx={{ marginTop: '10px', width: '100%' }} onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
        <Button sx={{ marginTop: '10px', width: '100%' }} onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

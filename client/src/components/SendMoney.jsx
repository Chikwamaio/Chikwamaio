import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useNavigate } from 'react-router-dom';


export default function SendMoney ({open, close}) {

  const handleClose = () => {
    close();
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Send Money</DialogTitle>
        <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            
            id="name"
            label="Receiver address"
            type="email"
            fullWidth
            variant="filled"
            
          />
          <TextField
            autoFocus
            margin="dense"
            
            id="name"
            label="Amount"
            type="email"
            fullWidth
            variant="filled"
            
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button>Send</Button>
        </DialogActions>
    </Dialog>
  );
}
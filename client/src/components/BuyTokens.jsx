import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Fab } from '@mui/material';

export default function FormDialog( {onClick} ) {
  const [open, setOpen] = React.useState(false);

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Fab variant="extended" onClick={handleClickOpen} className="text-white overflow-auto text-xl flex-grow float-right bg-fuchsia-700 mx-20 px-6 drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            Buy Tokens
          </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can buy a stake in Chikwama. Chikwama(CHK) tokens entitle you to a stake in the protocols revenues.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Number of tokens"
            type="email"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClick}>BUY</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog( {onClick} ) {
  const [open, setOpen] = React.useState(false);
  const [buy_tokens, setTokens] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleBuy = () => {
    onClick(buy_tokens); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button className="text-white bg-fuchsia-700 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring float-right font mr-6" onClick={handleClickOpen} >
            Buy Tokens
          </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can buy a stake in Chikwama. Chikwama(CHK) tokens entitle you to a stake in the protocols revenues.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value = {buy_tokens}
            id="name"
            label="Number of tokens"
            type="email"
            fullWidth
            variant="filled"
            onChange={(e) => {
                setTokens(e.target.value);
              }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBuy}>BUY</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function FormDialog( {buyTokens, open, close} ) {
  
  const [tokensToBuy, setTokens] = React.useState('');

  const handleBuy = () => {
    buyTokens(tokensToBuy); 
  };

  const handleClose = () => {
    close();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can buy a stake in Chikwama. Chikwama(CHK) tokens entitle you to a stake in the DAO's revenues.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            value = {tokensToBuy}
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

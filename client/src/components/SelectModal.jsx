import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog( {openSelect, closeSelect, openBuy} ) {


  const handleBuy = () => {
    closeSelect();
    openBuy(); 
  };

  const handleClose = () => {
    closeSelect();
  };

  return (
    <div>
      <Dialog open={openSelect} onClose={handleClose}>
        <DialogTitle>Select a task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What would you like to do today, Buy/sell or send some digital dollars?
          </DialogContentText>
          <button className="align-center text-white bg-fuchsia-700 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring" onClick={handleBuy}>BUY/SELL</button>
          <p>OR</p>
          <button className="text-white bg-fuchsia-700 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">SEND</button>
        </DialogContent>
        <DialogActions>
        <Button className='hover:text-fuchsia-700' onClick={handleClose}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}

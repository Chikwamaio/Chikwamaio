import * as React from 'react';
import Button from '@mui/material/Button';
import StoreIcon from '@mui/icons-material/Store';
import SendIcon from '@mui/icons-material/Send';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { purple } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';


export default function SelectModal ({open, close}) {
  const navigate = useNavigate();
  const handleClick = () => navigate('/cashpoints');;

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>What would you like to do today?</DialogTitle>
      <List sx={{ pt: 2 }}>
      <ListItem button>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: purple[100], color: purple[600] }}>
                <SendIcon/> 
              </Avatar>
            </ListItemAvatar>
            <ListItemText  primary='SEND FUNDS'/>
          </ListItem>
          <ListItem button onClick={handleClick}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: purple[100], color: purple[600] }}>
                <StoreIcon/> 
              </Avatar>
            </ListItemAvatar>
            <ListItemText  primary='FIND A CASHPOINT'/>
          </ListItem>
      </List>
      <DialogActions>
      <button onClick={close} className="text-white bg-fuchsia-700 py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            Cancel
          </button>
        </DialogActions>
    </Dialog>
  );
}
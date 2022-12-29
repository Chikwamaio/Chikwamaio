import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';


export default function AddCashPoint({open, close, update, add}) {

 
  const [feeAmount, setFee] = useState('');
  const [currency, setCurrency] = useState('Currency');

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);

  const handleClose = () => {
    close();
  };

  const handleAdd = () => {
    //send(toAddress,amount, feeAmount);
  }


  const getCostHandler = async (amount) => {

    const fee = await cashPointsContract.CASHPOINT_FEE();
    let cost = ethers.utils.parseUnits(((parseInt(fee.toString())) * amount).toString(),"ether");
   
    setFee(ethers.utils.formatEther(cost));

  }

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 365,
      label: '365',
    },
  ];


  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Add a cash point</DialogTitle>
        <DialogContent>
        <DialogContentText>
        You are about to create a cash point at this location.</DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Cash point name"
            type="text"
            fullWidth
            variant="filled"
            onChange={(e) => {
              
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            //value={amount}
            id="phone"
            label="Phone Number"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              //const amount = e.target.value;
              //setAmount(amount);
              //await getCostHandler(amount);
            }}
          />
           <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={currency}
          label='Currency'
          //onChange={handleChange}
        >
            <MenuItem value="">
            <em>None</em>
          </MenuItem>
    </Select>
          <TextField
            autoFocus
            margin="dense"
            //value={amount}
            id="buyRate"
            label="Buy rate"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              //const amount = e.target.value;
              //setAmount(amount);
              //await getCostHandler(amount);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            //value={amount}
            id="sellRate"
            label="Sell rate"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              //const amount = e.target.value;
              //setAmount(amount);
              //await getCostHandler(amount);
            }}
          />
          <Typography style={{padding: 10, color:'grey'}} id="input-slider">
        Duration(Days)
      </Typography>
         <Slider sx={{ width: 260 }} defaultValue={30} step={1} marks={marks} min={0} max={365} valueLabelDisplay="auto"/>
          <DialogContentText>
           Fee: $</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
    </Dialog>
  );
}
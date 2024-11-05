import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers';
import * as React from 'react';
import { useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';


export default function SendMoney({open, close, send, cashPoint}) {

  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [feeAmount, setFee] = useState('');
  const [loading, setLoading] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
  const handleClose = () => {
    close();
  };

  const handleSend = () => {
    send(toAddress,amount, feeAmount);
  }


  const getCostHandler = async (amount) => {
    setLoading(true);
    const fee = await cashPointsContract.TRANSACTION_COMMISION();
    let cost = ethers.utils.parseUnits(((parseInt(fee.toString())/100) * amount).toString(),"ether");
   
    setFee(ethers.utils.formatEther(cost));
    setLoading(false);

  }


  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Withdraw</DialogTitle>
        <DialogContent>
        <DialogContentText>
            You are about to withdraw from {cashPoint?.name} cashpoint at the rate 1 DOC to {cashPoint?.buyRate} {cashPoint?.currency} in {cashPoint?.city}.
          </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            value={toAddress}
            id="name"
            label="Receiver's address"
            type="text"
            fullWidth
            variant="filled"
            onChange={(e) => {
              setToAddress(e.target.value);
            }}
            
          />
          {loading&&<CircularProgress sx={{
              position: 'absolute',
              top: 160,
              left: 120,
              zIndex: 1,
            }} size={68} color="secondary" />}
          <TextField
            autoFocus
            margin="dense"
            value={amount}
            id="name"
            label="Amount"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              const amount = e.target.value;
              setAmount(amount);
              await getCostHandler(amount);
            }}
            
          />
          
          <DialogContentText>
           Fee: ${feeAmount}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!amount || !toAddress} onClick={handleSend}>Send</Button>
        </DialogActions>
    </Dialog>
  );
}
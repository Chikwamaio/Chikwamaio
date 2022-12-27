import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';


export default function SendMoney({open, close, send}) {

  const [amount, setAmount] = React.useState('');
  const [toAddress, setToAddress] = React.useState('');
  const [feeAmount, setFee] = React.useState('');

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

    const fee = await cashPointsContract.TRANSACTION_COMMISION();
    let cost = ethers.utils.parseUnits(((parseInt(fee.toString())/100) * amount).toString(),"ether");
   
    setFee(ethers.utils.formatEther(cost));

  }

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Send Money</DialogTitle>
        <DialogContent>
        <DialogContentText>
            If the receiver intends to cashout please ensure there is a <a href='/cashpoints'>Chikwama cash point</a> near them.
          </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            value={toAddress}
            id="name"
            label="Receiver address"
            type="email"
            fullWidth
            variant="filled"
            onChange={(e) => {
              setToAddress(e.target.value);
            }}
            
          />
          <TextField
            autoFocus
            margin="dense"
            value={amount}
            id="name"
            label="Amount"
            type="email"
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
          <Button onClick={handleSend}>Send</Button>
        </DialogActions>
    </Dialog>
  );
}
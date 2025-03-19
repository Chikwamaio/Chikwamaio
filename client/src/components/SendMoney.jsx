import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';


export default function SendMoney({open, close, send, cashPoint}) {

  const [amount, setAmount] = useState(0);
  const [feeAmount, setFee] = useState('');
  const [loading, setLoading] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;

  const ethereum = (window).ethereum;
  const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
  const signer = provider?.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
  const handleClose = () => {
    close();
  };

  const handleSend = () => {
    send(amount, feeAmount, cashPoint.address, true);
  }

  const calculateFee = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setFee("");
      return;
    }

      setLoading(true);

      const commission = await cashPointsContract.TRANSACTION_COMMISION();

      const amountInWei = ethers.utils.parseEther(amount.toString());

      const cost = amountInWei.mul(commission).div(100);

      setFee(parseFloat(ethers.utils.formatEther(cost)).toFixed(2));

      setLoading(false);
  };

  useEffect(() => {
    calculateFee();
  }, [amount]);



  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>CASH OUT</DialogTitle>
        <DialogContent>
            {cashPoint && (
        <DialogContentText>
            You are about to cash out from <b>{cashPoint?.name} cashpoint in {cashPoint?.city}</b> at the rate 1 xDAI to {(cashPoint?.currency)?.split('-')[0].trim()} {cashPoint?.buyRate}.
            Enter the amount you would like to cash out below:
          </DialogContentText>
            )}
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
            label="Amount in xDAI"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              const amount = e.target.value;
              setAmount(amount);  
            }}
            
          />
       <div className="bg-slate-500 p-4 w-max text-sm">
  <div className="flex justify-between text-white">
    <span className="text-left">Convenience fee: </span>
    <span className="text-right" style={{ fontFamily: 'Digital-7, monospace' }}>${feeAmount}</span>
  </div>
  <div className="flex justify-between text-white">
    <span className="text-left">You will receive: </span>
    {cashPoint && 
    <span className="text-right" style={{ fontFamily: 'Digital-7, monospace' }}>
      {(cashPoint?.currency)?.split('-')[0].trim()}
      {new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount * cashPoint?.buyRate)}
    </span>
}
  </div>
</div>
<DialogContentText
      sx={{ marginTop: 2, fontSize: '0.85rem', color: 'gray', textAlign: 'center' }}
    >
      <em>
        Please note: You must physically meet the cashpoint operator at the specified location to complete this cash out. Please confirm {cashPoint?.address} is their Chikwama address
      </em>
    </DialogContentText>
        </DialogContent> 
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!amount} onClick={handleSend}>CASH OUT</Button>
        </DialogActions>
    </Dialog>
  );
}
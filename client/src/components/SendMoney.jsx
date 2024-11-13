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
  const [feeAmount, setFee] = useState('');
  const [gasFee, setGasFee] = useState('');
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
    send(amount, feeAmount, gasFee);
  }


  const getCostHandler = async (amount) => {
    setLoading(true);
    const fee = await cashPointsContract.TRANSACTION_COMMISION();
    let cost = ethers.utils.parseUnits(((parseInt(fee.toString())/100) * amount).toString(),"ether");
   
  
    const transaction = {
      to: cashPoint.address,
      value: ethers.utils.parseEther(amount),
    };

    try {
      // Estimate gas for the transfer
      const estimatedGas = await provider.estimateGas(transaction);
      console.log('Estimated Gas:', estimatedGas.toString());
  
      // Optionally, you can estimate the gas price
      const gasPrice = await provider.getGasPrice();
      console.log('Gas Price:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei');
  
      // Calculate total transaction cost (gas fee in ether)
      const totalGasFee = estimatedGas.mul(gasPrice);
      setGasFee(ethers.utils.formatEther(totalGasFee));
    } catch (error) {
    setGasFee('unable to calculate gas fee');
    }
      
    
    setFee(ethers.utils.formatEther(cost));
    setLoading(false);

  }


  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>Withdraw</DialogTitle>
        <DialogContent>
        <DialogContentText>
            You are about to withdraw from {cashPoint?.name} cashpoint at the rate 1 DOC to {cashPoint?.buyRate} {cashPoint?.currency} in {cashPoint?.city}.

            Enter the amount you would like to withdraw below
          </DialogContentText>

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
       <div className="bg-slate-500 p-4 w-max text-sm">
  <div className="flex justify-between text-white">
    <span className="text-left">Fee:</span>
    <span className="text-right">${feeAmount}</span>
  </div>
  <div className="flex justify-between text-white">
    <span className="text-left">You will receive:</span>
    <span className="text-right">
      {cashPoint?.currency}
      {new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount * cashPoint?.buyRate)}
    </span>
  </div>
  {gasFee && (
    <div className="flex justify-between text-white">
      <span className="text-left">Estimated Gas Fee:</span>
      <span className="text-right">${gasFee}</span>
    </div>
  )}
</div>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!amount} onClick={handleSend}>Send</Button>
        </DialogActions>
    </Dialog>
  );
}
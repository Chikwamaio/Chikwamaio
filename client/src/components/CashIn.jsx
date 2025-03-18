import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';


export default function CashIn({open, close, send, cashPoint, account}) {

  const [amount, setAmount] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [feeAmount, setFee] = useState('');
  const [gasFee, setGasFee] = useState('');
  const [loading, setLoading] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;
  const { ethereum } = window;
  const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
  const signer = provider?.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
  const handleClose = () => {
    close();
  };

  const handleSend = () => {
    send(amount, feeAmount, toAddress, false);
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
      <DialogTitle>CASH IN</DialogTitle>
        <DialogContent>
            {cashPoint && (
        <DialogContentText>
            You are about to perform a cash in at <b>{cashPoint?.name} cashpoint in {cashPoint?.city}</b> at the rate 1 xDAI to {(cashPoint?._currency)?.split('-')[0].trim()} {(cashPoint?.sellRate)?.toString()}.
            Enter the amount of xDAI you would like to sell and the account of the user you are selling to below:
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
            value={toAddress}
            id="name"
            label="User Account"
            type="text"
            placeholder='0x3f32f..'
            fullWidth
            variant="filled"
            onChange={async(e) => {
              const address = e.target.value;
              setToAddress(address);
              
            }}
            
          />
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
      }).format(amount * cashPoint?.sellRate)}
    </span>
}
  </div>
</div>
<DialogContentText
      sx={{ marginTop: 2, fontSize: '0.85rem', color: 'gray', textAlign: 'center' }}
    >
      <em>
        Please note: You must physically collect the cash from the user
      </em>
    </DialogContentText>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!amount} onClick={handleSend}>CASH IN</Button>
        </DialogActions>
    </Dialog>
  );
}
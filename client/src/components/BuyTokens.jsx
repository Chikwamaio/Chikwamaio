import * as React from 'react';
import { useState, useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';


export default function FormDialog( {buyTokens, open, close, available} ) {
  
  const [tokensToBuy, setTokens] = useState('');
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  const abi = cashPoints.abi;

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);

  const handleBuy = () => {
    buyTokens(tokensToBuy); 
  };

  const handleClose = () => {
    close();
  };

  const getPriceHandler = async () => {
    setLoading(true);
    const tokenPrice = await cashPointsContract.PRICE_PER_TOKEN();
    const value = ethers.utils.formatEther(tokenPrice)*tokensToBuy;
    setValue(value);
    setLoading(false);

  }


  useEffect(() => {
    
  }, [])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can buy a stake in Chikwama. Chikwama(CHK) tokens entitle you to a stake in the DAO's revenues. There are currently {available} CHK tokens available. 
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
            value = {tokensToBuy}
            id="name"
            label="Number of tokens"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
                const tokens =  e.target.value;
                setTokens(tokens);
                await getPriceHandler();
              }}
          />
          <DialogContentText>
            Value: $ {value}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={loading} onClick={handleBuy}>BUY</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

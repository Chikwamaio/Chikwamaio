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
import { useEffect, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';


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


  const getPriceHandler = async (tokens) => {
    setLoading(true);
    try {
        const tokenPrice = await cashPointsContract.PRICE_PER_TOKEN();
        const totalValue = ethers.BigNumber.from(tokens).mul(tokenPrice); 
        setValue(ethers.utils.formatEther(totalValue)); 
    } catch (error) {
        console.error("Error calculating cost:", error);
    }
    setLoading(false);
};


  useEffect(() => {
    
  }, [])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can buy a stake in Chikwama. Chikwama(CHK) tokens entitle you to a stake in the DAO's revenues. There are currently {available} CHK tokens available out of the total 100,000. 
          </DialogContentText>
          {loading&&<CircularProgress sx={{
              position: 'absolute',
              top: 160,
              left: 120,
              zIndex: 1,
            }} size={68} color="secondary" />}
          <TextField
          required
            autoFocus
            margin="dense"
            value = {tokensToBuy}
            id="name"
            label="Number of tokens"
            type="number"
            fullWidth
            variant="filled"
            onChange={async(e) => {
              const tokens = e.target.value
                setTokens(tokens);
                await getPriceHandler(tokens);
              }}
          />
          <DialogContentText>
            Value: $ {value}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!tokensToBuy || loading} onClick={handleBuy}>BUY</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

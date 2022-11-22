import NavBar from './NavBar'
import Footer from './Footer'
import { useState } from 'react';
import { useEffect } from 'react';
import BuyTokens from './BuyTokens'
import { ethers } from 'ethers';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar'

const Dao = () => {

    const { ethereum } = window;
    const abi = cashPoints.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [walletAddress, setWalletAddress] = useState('')
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [state, setState] = useState({
        open: false,
        Transition: Fade,
      });
   const [errorMessage, setErrorMessage] = useState('');

   const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

   const  handleOpen = () => { setOpenBuyModal(true); };
   const handleCloseBuyModal = () => { setOpenBuyModal(false); };
    const buyTokensHandler = async (tokens) => {
        provider.getBalance(contractAddress).then(async (balance)=> {
          const network = (await provider.getNetwork()).chainId;
  
          if(network != 100)
          {
            setState({
              open: true,
              Transition: Fade,
            });
            setErrorMessage('You are connected to the wrong blockchain, please connect to the Gnosis chain');
            return;
          }
  
          if(balance == 0){
  
            setState({
              open: true,
              Transition: Fade,
            });
  
            setErrorMessage('We are unable to fulfill your buy request at this time, because there is no value in the contract');
            return;
          }
  
          
  
          if(tokens % 1 == 0 && tokens > 0 )
          {
            await cashPointsContract.setPrice();
            const newPrice = await cashPointsContract.PRICE_PER_TOKEN();
            let cost = ethers.utils.formatEther(newPrice) * tokens;
            const buyTokens = cashPointsContract.buyTokens(tokens, { value: ethers.utils.parseUnits(cost.toString(), "ether")});
          }
        });
          
    }

    const checkWalletIsConnected = async () => {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      setWalletAddress(accounts[0]);
    }
    
       useEffect(() => {
        checkWalletIsConnected();
      }, [])

    return(
        <><div className='min-h-screen flex flex-col text-slate-500'>
        <NavBar walletAddress={walletAddress}/>
        <main className=' text-black container mx-auto px-6 pt-16 flex-1 text-left'>
            <button onClick={handleOpen} className="text-white bg-fuchsia-700 py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">Buy DAO Tokens</button>
        <BuyTokens open={openBuyModal} buyTokens={buyTokensHandler} close={handleCloseBuyModal}></BuyTokens>
        </main>
        <Snackbar 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={state.open}
        onClose={handleClose}
        autoHideDuration={3000}
        TransitionComponent={state.Transition}
        message={errorMessage}
        key={state.Transition.name}>
        
        </Snackbar>
        <Footer/>
        </div>
        </>);
}

export default Dao;
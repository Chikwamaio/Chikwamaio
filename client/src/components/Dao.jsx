import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import BuyTokens from './BuyTokens';
import Footer from './Footer';
import NavBar from './NavBar';
import Withdraw from './Withdraw';


const Dao = () => {

  const [loading, setLoading] = useState(false);
    const { ethereum } = window;
    const abi = cashPoints.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [walletAddress, setWalletAddress] = useState('')
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0)
    const [availableTokens, setAvailableTokens] = useState('');
    const [daiBalance, setDaiBalance] = useState();
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

  const  handleOpenBuy = async() => { 
    setLoading(true);
    const tokens = (await cashPointsContract.AVAILABLE_TOKENS()).toString();
    setAvailableTokens(tokens);
    setLoading(false);
    setOpenBuyModal(true); 
  
  };

  const  handleOpenWithdraw = async() => { 
    setOpenWithdrawModal(true); 
  
  };

  const handleCloseBuyModal = () => {setLoading(true); setOpenBuyModal(false); setLoading(false)};
  const handleCloseWithdrawModal = () => { setOpenWithdrawModal(false); };
  const buyTokensHandler = async (tokens) => {
        const balance = await provider.getBalance(contractAddress);
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
  
          
  
          if(tokens % 1 != 0 )
          {
            setState({
              open: true,
              Transition: Fade,
            });
  
            setErrorMessage('Tokens are non divisible please enter an integer value');
            return;
          }

          if(tokens == 0 )
          {
            setState({
              open: true,
              Transition: Fade,
            });
  
            setErrorMessage(`You cannot buy ${tokens} CHK`);
            return;
          }

          const newPrice = await cashPointsContract.PRICE_PER_TOKEN();
          let cost = ethers.utils.formatEther(newPrice) * tokens;

          try{
            const buyTokens = await cashPointsContract.buyTokens(tokens, { value: ethers.utils.parseUnits(cost.toString(), "ether")});
            setState({
              open: true,
              Transition: Fade,
            });
      
            setErrorMessage(`Transaction successful: ${JSON.stringify(buyTokens.hash)}`);
            handleCloseBuyModal();
          }catch(e){

            setState({
              open: true,
              Transition: Fade,
            });
      
            setErrorMessage(`Transaction failed: ${e.message}`);
          }
          
          
    }

    const withdrawHandler = async (tokens) => {

      if(tokens % 1 != 0 )
          {
            setState({
              open: true,
              Transition: Fade,
            });
  
            setErrorMessage('Tokens are non divisible please enter an integer value');
            return;
          }

      try{
        const withdraw = await cashPointsContract.withdraw(tokens);
      setState({
        open: true,
        Transition: Fade,
      });

      setErrorMessage(`Transaction successful: ${JSON.stringify(withdraw.hash)}`);
      handleCloseWithdrawModal();
      }catch(e){
        setState({
          open: true,
          Transition: Fade,
        });
  
        setErrorMessage(`Transaction failed: ${e.message}`);
      }
      

    };

    const checkWalletIsConnected = async () => {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      setWalletAddress(accounts[0]);
      const balance = await cashPointsContract.balanceOf(accounts[0]);
      setTokenBalance(balance);
      const DaiBalance = await provider.getBalance(accounts[0])
      setDaiBalance(ethers.utils.formatEther(DaiBalance));
    }
    
       useEffect(() => {
        checkWalletIsConnected();
      }, [])

    return(
        <><div className='min-h-screen flex flex-col text-slate-500'>
        <NavBar walletAddress={walletAddress} walletBalance={daiBalance}/>
        <main className=' text-black container mx-auto px-6 pt-16 flex-1 text-left'>
        <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama DAO</h1>
        <p>A DAO or decentralised autonomous organisation is a member-owned community without centralized leadership. Created because said members share a common goal. The rules that govern a DAO are encoded as a <Link 
  className="text-[#872A7F]" 
  color="inherit" 
  href="https://github.com/Chikwamaio/Chikwamaio/blob/master/contracts/contracts/Cashpoints.sol"
  target="_blank" 
  rel="noopener noreferrer"
>
  computer program.
</Link></p>
        <br></br>
        <p>The chikwama DAO was created to catalyse the creation of a global network of blockchain based digital dollar cashpoints. The original members believe that would be cash point operators can be incentivised to operate cash points by allowing them to <Link className='text-[#872A7F] ' color="inherit" component='button' onClick={handleOpenBuy}>own a stake in the DAO</Link> and <Link className='text-[#872A7F] ' color="inherit" component='button' onClick={handleOpenWithdraw}>liquidate</Link> their stake in a permissionless manner. </p>
        {loading&&<CircularProgress sx={{
              position: 'absolute',
              top: 250,
              left: 120,
              zIndex: 1,
            }} size={68} color="secondary" />}
        <BuyTokens open={openBuyModal} buyTokens={buyTokensHandler} close={handleCloseBuyModal} available={availableTokens}></BuyTokens>
        <Withdraw open={openWithdrawModal} withdraw={withdrawHandler} close={handleCloseWithdrawModal} balance={tokenBalance}></Withdraw>
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
import NavBar from './NavBar'
import Footer from './Footer'
import BuyTokens from './BuyTokens'
import { useState, useEffect} from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar'
import Fade from '@mui/material/Fade';


const Home = () => {
    const [count, setCount] = useState(0)
    const [walletAddress, setWalletAddress] = useState('')
    const [revenue, setRevenue] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [tokenPrice, setTokenPrice] = useState(0)
    const navigate = useNavigate();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const abi = cashPoints.abi;
    const [currentAccount, setCurrentAccount] = useState(null);
    let NumberOfCashPoints;
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [state, setState] = useState({
      open: false,
      Transition: Fade,
    });

    const [errorMessage, setErrorMessage] = useState('');

    const buyTokensHandler = async (tokens) => {
      provider.getBalance(contractAddress).then(async (balance)=> {
      
        if(balance == 0){

          setState({
            open: true,
            Transition: Fade,
          });

          setErrorMessage('We are unable to fulfill your buy request at this moment because, there is no value in the contract');
          return;
        }

        if(tokens % 1 == 0 && tokens > 0)
        {
          await cashPointsContract.setPrice();
          const newPrice = await cashPointsContract.PRICE_PER_TOKEN();
          let cost = ethers.utils.formatEther(newPrice) * tokens;
          const buyTokens = cashPointsContract.buyTokens(tokens, { value: ethers.utils.parseUnits(cost.toString(), "ether")});
        }
      });
        
  }
  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  
    const checkWalletIsConnected = async () => {
    
    const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
    console.log(contractAddress);
    setWalletAddress(accounts[0]);

    if(!ethereum)
    {
      setState({
        open: true,
        Transition: Fade,
      });

      setErrorMessage('Please install the metaamask wallet extension');
      return;
    }

      console.log('wallet connected');

      let tokenBalance = await cashPointsContract.balanceOf(accounts[0]);
      setTokenBalance(tokenBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

      let tokenPrice = await cashPointsContract.PRICE_PER_TOKEN();
      setTokenPrice(ethers.utils.formatEther(tokenPrice));

      let NumberOfCashPointsTXN = await cashPointsContract.count();
      NumberOfCashPoints = NumberOfCashPointsTXN.toNumber();
      setCount(NumberOfCashPoints);

      provider.getBalance(contractAddress).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInDai = ethers.utils.formatEther(balance);
        setRevenue(balanceInDai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        console.log(`balance: ${balanceInDai} xDai`)
       })

   }

   const goToCashPoints = async () => {
        navigate('/CashPoints', contractAddress, abi)
   }

  


  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='container mx-auto text-slate-500'>
    <NavBar walletAddress={walletAddress}/>
      <main className='flex flex-grow p-2 min-h-max'>
      <div className='basis-1/2'>
      <h2 className='text-2xl md:text-4xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
      <h1 className='text-3xl md:text-6xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
      <p className='text-xl py-12'>Send, Receive, Buy and Sell digital dollars, anywhere.</p>
      <BuyTokens onClick={buyTokensHandler}></BuyTokens>
      </div>
      <div className='basis-1/2 grid gap-2 grid-cols-2'>
      
      <div className='bg-slate-800 bg-opacity-20 w-fit mx-auto mb-4 rounded-xl float-right'>
      <p className='text-xl text-yellow-400 text-center'>US${tokenPrice} </p> <p className='text-center'>Current Price</p>
      
      </div>
      <div className='bg-slate-800 bg-opacity-20 w-fit mx-auto mb-4 rounded-xl float-right'>
      <p className='text-xl text-yellow-400 text-center'>{tokenBalance}CHK</p> <p className='text-center'>Token Balance</p></div>
      <div className='bg-slate-800  bg-opacity-20 w-fit mx-auto mb-4 rounded-xl float-right'>
      <p className='text-xl text-yellow-400 text-center'>US${revenue}</p> <p className='text-center'>Contract Balance</p>
      </div>
      </div>
      <Snackbar 
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={state.open}
        onClose={handleClose}
        autoHideDuration={3000}
        TransitionComponent={state.Transition}
        message={errorMessage}
        key={state.Transition.name}>
        
        </Snackbar>
      </main>
      <Footer/>
    </div>
  )
}

export default Home;
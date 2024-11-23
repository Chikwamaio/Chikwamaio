import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalculateIcon from '@mui/icons-material/Calculate';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PieChartIcon from '@mui/icons-material/PieChart';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import Footer from './Footer';
import NavBar from './NavBar';




const Home = () => {
    const [count, setCount] = useState(0)

    const [walletAddress, setWalletAddress] = useState('')
    const [revenue, setRevenue] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [tokenPrice, setTokenPrice] = useState(0);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
    const navigate = useNavigate();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const abi = cashPoints.abi;
    const [currentAccount, setCurrentAccount] = useState(null);
    let NumberOfCashPoints;
    const { ethereum } = window;
    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
    const signer = provider ? provider.getSigner() : null;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [state, setState] = useState({
      open: false,
      Transition: Fade,
    });

    const [errorMessage, setErrorMessage] = useState('');

    

  const handleGotodao = () => {
    navigate('/dao');
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };




  
    const checkWalletIsConnected = async () => {
      if(!provider){
        
        setIsMetaMaskInstalled(false);
        return;
      }
    const network =(await provider.getNetwork()).chainId;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
    setWalletAddress(accounts[0]);

    if(network != 100)
        {
          try {
            await window.ethereum.request({
              "method": "wallet_addEthereumChain",
              "params": [
                {
                  "chainId": "0x64",
                  "chainName": "Gnosis",
                  "rpcUrls": [
                    "https://rpc.ankr.com/gnosis"
                  ],
                  "iconUrls": [
                    "https://xdaichain.com/fake/example/url/xdai.svg",
                    "https://xdaichain.com/fake/example/url/xdai.png"
                  ],
                  "nativeCurrency": {
                    "name": "xDAI",
                    "symbol": "xDAI",
                    "decimals": 18
                  },
                  "blockExplorerUrls": [
                    "https://blockscout.com/poa/xdai/"
                  ]
                }
              ]
            });
        } catch (error) {
          setErrorMessage(error);
          return;
        }
          
        }

      const TokenBalance = await cashPointsContract.balanceOf(accounts[0]);

      setCurrentAccount(accounts[0])
      setTokenBalance(TokenBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

      const TokenPrice = await cashPointsContract.PRICE_PER_TOKEN();
      setTokenPrice(parseFloat(ethers.utils.formatEther(TokenPrice.toNumber())).toFixed(4));


      const NumberOfCashPointsTXN = await cashPointsContract.count();
      NumberOfCashPoints = NumberOfCashPointsTXN.toNumber();
      setCount(NumberOfCashPoints);

      provider.getBalance(contractAddress).then((balance) => {
        const balanceInDai = parseFloat(ethers.utils.formatEther(balance)).toFixed(2);
        const formattedBalance = balanceInDai.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setRevenue(formattedBalance);
    });
    
   }

   const goToCashPoints = async () => {
        navigate('/CashPoints', contractAddress, abi)
   }

  


  useEffect(() => {
    checkWalletIsConnected();


    
  }, [])


  const renderMetaMaskPrompt = () => (
    <div className="flex flex-col items-center justify-center h-screen text-center text-slate-500">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600">Oops! No MetaMask detected!</h2>
        <p className="mt-4 text-lg">
            This is a blockchain app. To experience the *Internet of Value*, you'll need MetaMask installed.  
            <br />
            Don't worry, it's not as scary as it sounds!
        </p>
        <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 px-4 py-2 bg-[#872A7F] text-white rounded hover:bg-transparent hover:text-[#872A7F] border border-[#872A7F]"
        >
            Install MetaMask
        </a>
    </div>
);
return isMetaMaskInstalled ? (
    
    <div className='container w-full h-screen text-slate-500'>
    <NavBar walletAddress={walletAddress}/>
      <main className='flex flex-grow w-full md:pt-24 pt-24 min-h-max'>
      <div className='basis-1/2 pr-4'>
      <h2 className='md:text-3xl text-3xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
      <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
      
      <p className='text-xl py-12'>Send, receive, buy and sell digital dollars, anywhere!</p>
      <button onClick={goToCashPoints} className="text-white bg-[#872A7F]  py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-[#872A7F]  hover:border hover:border-[#872A7F]  focus:outline-none focus:ring">
            Find a Cashpoint!
          </button>
      </div>
      <div className='basis-1/2 grid grid-cols-1 align-center'>
    <h4 className='text-xl text-slate-700 lg:text-2xl uppercase text-left'>DAO Metrics:</h4>
    
    <div className='bg-white mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-40 metric-container relative'>
        <CalculateIcon />
        <p className='text-xl text-yellow-400 text-left'>US$ {tokenPrice}</p> 
        <p className='text-left'>Current Price</p>
        <div className='absolute top-1 right-1 group'>
            <span className='text-gray-400 cursor-pointer'><HelpOutlineIcon/></span>
            <div className='hidden group-hover:block absolute bg-gray-800 text-white text-sm p-2 rounded-lg shadow-md w-40 tooltip-container'>
                This is the current price of the CHK token in USD.
            </div>
        </div>
    </div>
    
    <div className='bg-white mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-40 metric-container relative'>
        <PieChartIcon />
        <p className='text-xl text-yellow-400 text-left'>{tokenBalance} CHK</p> 
        <p className='text-left'>Your Balance</p>
        <div className='absolute top-1 right-1 group'>
            <span className='text-gray-400 cursor-pointer'><HelpOutlineIcon/></span>
            <div className='hidden group-hover:block absolute bg-gray-800 text-white text-sm p-2 rounded-lg shadow-md w-40 tooltip-container'>
                This shows your current CHK token balance.
            </div>
        </div>
    </div>
    
    <div className='bg-white mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-40 metric-container relative'>
        <AccountBalanceIcon />
        <p className='text-xl text-yellow-400 text-left'>US$ {revenue}</p> 
        <p className='text-left'>Contract Balance</p>
        <div className='absolute top-1 right-1 group'>
            <span className='text-gray-400 cursor-pointer'><HelpOutlineIcon/></span>
            <div className='hidden group-hover:block absolute bg-gray-800 text-white text-sm p-2 rounded-lg shadow-md w-40 tooltip-container'>
                This indicates the total funds held in the DAO's smart contract, i.e., Chikwama DAO revenue to date.
            </div>
        </div>
    </div>
    
    <div className='align-center'>
        <button className='w-24 hover:text-[#872A7F]' onClick={handleGotodao}>Learn more...</button>
    </div>
</div>
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
      </main>
      <Footer />
    </div>
  ): (
    renderMetaMaskPrompt()
);
}

export default Home;
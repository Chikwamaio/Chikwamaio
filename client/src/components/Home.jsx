import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalculateIcon from '@mui/icons-material/Calculate';
import PieChartIcon from '@mui/icons-material/PieChart';
import Fade from '@mui/material/Fade';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import Footer from './Footer';
import NavBar from './NavBar';
import { renderMetaMaskPrompt } from './InstallMetaMask';



const Home = () => {
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
    const [count, setCount] = useState(0)
    const [account, setAccount] = useState();
    const [openSend, setOpenSend] = useState(false);
    const [daiBalance, setDaiBalance] = useState();
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
    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
    const signer = provider?.getSigner();
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [state, setState] = useState({
      open: false,
      Transition: Fade,
    });

    const [errorMessage, setErrorMessage] = useState('');

    
  const handleOpenSend = () => {
    setOpenSend(true);
  };

  const handleGotodao = () => {
    navigate('/dao');
  };
  const closeSend = () => {
    setOpenSend(false);
  };
  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

    useEffect(() => {
      if (ethereum) {

        const getAccount = async () => {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        };
  
        getAccount(); 

        ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
          } else {
            setAccount(null); 
          }
        });
  

        return () => {
          ethereum.removeListener("accountsChanged", getAccount);
        };
      }
    }, []);
  
  
    const checkWalletIsConnected = async () => {

      if(!provider){
        
        setIsMetaMaskInstalled(false);
        return;
      }

      const network =(await provider.getNetwork()).chainId;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
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

    if(network != 0x64)
        {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x64",
                  chainName: "Gnosis Mainnet",
                  rpcUrls: ["https://rpc.gnosis.gateway.fm"],
                  nativeCurrency: {
                    name: "xDAI",
                    symbol: "xDAI",
                    decimals: 18
                  },
                  blockExplorerUrls: ["https://gnosisscan.io/"]
                }
              ]
            });
          } catch (error) {
            setErrorMessage(error);
            return;
          }
          
        }

      const TokenBalance = await cashPointsContract.balanceOf(accounts[0]);
      const DaiBalance = await provider.getBalance(accounts[0])
      setDaiBalance(ethers.utils.formatEther(DaiBalance));
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

    
  }, [walletAddress]);




  return isMetaMaskInstalled ? (
    
    <div className='w-full h-screen text-slate-500'>
    <NavBar walletAddress={walletAddress} walletBalance={daiBalance}/>
      <main className='flex flex-grow w-full md:pt-24 pt-24 min-h-max'>
      <div className="basis-1/2 p-6 md:p-12">
    <h2 className="text-xl md:text-2xl text-gray-500 lg:text-4xl tracking-wide uppercase">
      Welcome to
    </h2>
    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-600 uppercase mb-6">
      Chikwama
    </h1>
    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
      Empowering families and businesses one transaction at a time. From bustling cities to remote villages.
    </p>
    <p className="text-base md:text-lg text-gray-600 leading-relaxed mt-4">
      Chikwama connects you to your loved ones and opportunities, with low-cost digital dollar conversions.
    </p>
    <button
      onClick={goToCashPoints}
      className="mt-6 text-white bg-[#872A7F] py-3 px-8 rounded-full shadow-lg border border-transparent hover:bg-transparent hover:text-[#872A7F] hover:border-[#872A7F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#872A7F]"
    >
      Find a Cashpoint!
    </button>
  </div>

    <div className='basis-1/2 grid grid-cols-1 align-center bg-opacity-75  p-4'>
    <h4 className='text-xl text-gray-600 lg:text-2xl uppercase text-left'> DAO Metrics:</h4>
    <div className='bg-white rounded-md mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-40 metric-container relative  z-30'>
        <CalculateIcon />
        <p className='text-xl text-yellow-400 text-left' style={{ fontFamily: 'Digital-7, monospace' }}>US$ {tokenPrice}</p> 
        <p className='text-left'>Current Price</p>
        <div className='absolute top-1 right-1 group'>
            <span className='text-gray-400 cursor-pointer'><HelpOutlineIcon/></span>
            <div className='hidden group-hover:block absolute right-1 bg-gray-800 text-white text-sm p-2 rounded-lg shadow-md w-40 tooltip-container'>
                This is the current price of the Chikwama token in USD.
            </div>
        </div>
    </div>
    
    <div className='bg-white rounded-md mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-40 metric-container relative z-10'>
        <PieChartIcon />
        <p className='text-xl text-yellow-400 text-left' style={{ fontFamily: 'Digital-7, monospace' }}>{tokenBalance} CHK</p> 
        <p className='text-left'>Your Balance</p>
        <div className='absolute top-1 right-1 group'>
            <span className='text-gray-400 cursor-pointer'><HelpOutlineIcon/></span>
            <div className='hidden group-hover:block absolute right-1 bg-gray-800 text-white text-sm p-2 rounded-lg shadow-md w-40 tooltip-container'>
                This shows your current Chikwama token balance.
            </div>
        </div>
    </div>
    
    <div className='bg-white rounded-md mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-40 metric-container relative'>
        <AccountBalanceIcon />
        <p className='text-xl text-yellow-400 text-left' style={{ fontFamily: 'Digital-7, monospace' }}>US$ {revenue}</p> 
        <p className='text-left'>Contract Balance</p>
        <div className='absolute top-1 right-1 group'>
            <span className='text-gray-400 cursor-pointer'><HelpOutlineIcon/></span>
            <div className='hidden group-hover:block absolute right-1 bg-gray-800 text-white text-sm p-2 rounded-lg shadow-md w-40 tooltip-container'>
                This indicates the total funds held in the DAO's smart contract, i.e., Chikwama DAO revenue to date less any stake liquidations.
            </div>
        </div>
    </div>
    <div className='align-center'>
    <button className='w-24 hover:text-fuchsia-700' onClick={handleGotodao}> Learn more...</button>
    </div>
    </div>
      </main>
      <Footer className/>
    </div>
  ): (
    renderMetaMaskPrompt()
);
}

export default Home;
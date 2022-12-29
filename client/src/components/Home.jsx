import NavBar from './NavBar'
import Footer from './Footer'
import SendMoney from './SendMoney'
import { useState, useEffect} from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar'
import Fade from '@mui/material/Fade';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PieChartIcon from '@mui/icons-material/PieChart';
import CalculateIcon from '@mui/icons-material/Calculate';


const Home = () => {
    const [count, setCount] = useState(0)
    const [openSend, setOpenSend] = useState(false);
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



  const sendMoneyHandler =  async (toAddress, amount, fee) => {

    const balance = await provider.getBalance(currentAccount);
    const address = toAddress;
    const amountEther = ethers.utils.parseUnits(amount, "ether");
    const feeEther = ethers.utils.parseUnits(fee, "ether");
    const totalCost = (amountEther.add(feeEther));
    if(balance< totalCost) {
      setState({
        open: true,
        Transition: Fade,
      });
      setErrorMessage(`You have less than $${ethers.utils.formatEther(totalCost)} in your wallet ${currentAccount}`);
    }


    const sendXdai = await cashPointsContract.send(amountEther, toAddress, { value: ethers.BigNumber.from(totalCost.toString()) });

    setState({
      open: true,
      Transition: Fade,
    });
    setErrorMessage(`${sendXdai.toString()}`);

  }

  
    const checkWalletIsConnected = async () => {
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

    if(network != 100)
        {
          setErrorMessage('You are connected to the wrong blockchain, please connect to the Gnosis chain');
          return;
        }

      let tokenBalance = await cashPointsContract.balanceOf(accounts[0]);

      setCurrentAccount(accounts[0])
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
       })

   }

   const goToCashPoints = async () => {
        navigate('/CashPoints', contractAddress, abi)
   }

  


  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='container w-full h-screen text-slate-500'>
    <NavBar walletAddress={walletAddress}/>
      <main className='flex flex-grow w-full md:pt-24 pt-24 min-h-max'>
      <div className='basis-1/2 pr-4'>
      <h2 className='md:text-3xl text-3xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
      <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
      <p className='text-xl py-12'>Send, receive, buy and sell digital dollars, anywhere!</p>
      <button onClick={handleOpenSend} className="text-white bg-fuchsia-700 py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            Use it!
          </button>
      </div>
      <div className='basis-1/2 grid grid-cols-1 align-center'>
      <h4 className='text-xl text-slate-700 lg:text-2xl uppercase text-left'> DAO Metrics:</h4>
      <div className='bg-white mx-auto mb-4 float-right m-4 p-2 border-2 border-gray-300 h-24 w-36'>
      <CalculateIcon></CalculateIcon><p className='text-xl text-yellow-400 text-left'>US$ {tokenPrice} </p> <p className='text-left'>Current Price</p>
      </div>
      <div className='bg-white mx-auto mb-4 float-right p-2 border-2 border-gray-300 h-24 w-36'>
      <PieChartIcon></PieChartIcon><p className='text-xl text-yellow-400 text-left'>{tokenBalance} CHK</p> <p className='text-left'>Your Balance</p></div>
      <div className='bg-white mx-auto mb-4  float-right p-2 border-2 border-gray-300 h-24 w-36'>
      <AccountBalanceIcon></AccountBalanceIcon><p className='text-xl text-yellow-400 text-left'>US$ {revenue}</p> <p className='text-left'>Contract Balance</p>
      </div>
      <div className='align-center'>
      <button className='w-24 hover:text-fuchsia-700' onClick={handleGotodao}> Learn more...</button>
      </div>
      <SendMoney open={openSend} close={closeSend} send={sendMoneyHandler}></SendMoney>
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
      <Footer className/>
    </div>
  )
}

export default Home;
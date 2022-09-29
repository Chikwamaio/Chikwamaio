import NavBar from './NavBar'
import Footer from './Footer'
import { useState } from 'react';
import { useEffect } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [count, setCount] = useState(0)
    const [revenue, setRevenue] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [tokenPrice, setTokenPrice] = useState(0)
    const navigate = useNavigate();
    const contractAddress = '0xb31516b0e24c5230D0a19B1bbE752b5A37940298';
    const abi = cashPoints.abi;
    const [currentAccount, setCurrentAccount] = useState(null);
    let NumberOfCashPoints;
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);

    const buyTokensHandler = async () => {
        
    
        await cashPointsContract.buyTokens({ value: ethers.utils.parseUnits("1", "ether")});
          
    }
    const checkWalletIsConnected = async () => {
    
    const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
    console.log(accounts[0]);

    if(!ethereum)
    {
      console.log('wallet not connected');
    }
    else if(ethereum)
    {
      console.log('wallet connected');

      let tokenBalance = await cashPointsContract.balanceOf(accounts[0]);
      setTokenBalance(ethers.utils.formatEther(tokenBalance));

      let tokenPrice = await cashPointsContract.price();
      setTokenPrice(ethers.utils.formatEther(tokenPrice));

      let NumberOfCashPointsTXN = await cashPointsContract.count();
      NumberOfCashPoints = NumberOfCashPointsTXN.toNumber();
      setCount(NumberOfCashPoints);

      provider.getBalance(contractAddress).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInDai = ethers.utils.formatEther(balance);
        setRevenue(balanceInDai);
        console.log(`balance: ${balanceInDai} xDai`)
       })
    }
   }

   const goToCashPoints = async () => {
        navigate('/CashPoints', contractAddress, abi)
   }

  


  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='min-h-screen flex flex-col text-slate-500'>
    <NavBar/>
      <main className='container mx-auto px-6 pt-16 flex-1 text-left'>
      <h2 className='text-2xl md:text-4xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
      <h1 className='text-3xl md:text-6xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
      <p className='text-xl py-12'>Send, Receive, Buy and Sell digital dollars, anywhere.</p>
      <div className='text-lg  float-left text-yellow-400 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-4 rounded-full'>
      US$ {revenue} Contract Balance
      </div>
      <button onClick={goToCashPoints} className='text-lg float-left text-fuchsia-700 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-8 rounded-full hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 hover:py-5'>
      {count} Cash points
      </button>
      <div className='text-lg float-left text-yellow-400 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-8 rounded-full'>
      {tokenPrice} Current Price
      </div>
      <div className='text-lg float-left text-yellow-400 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-8 rounded-full'>
      {tokenBalance} CHK   Token Balance</div>
      <button onClick={buyTokensHandler} className="text-white text-xl float-right bg-fuchsia-700 mx-20 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            Buy
          </button>
      </main>
      <Footer/>
    </div>
  )
}

export default Home;
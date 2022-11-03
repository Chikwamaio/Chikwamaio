import NavBar from './NavBar'
import Footer from './Footer'
import { useState } from 'react';
import { useEffect } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';


const CashPoints = () => {

    const [data, getData] = useState([]);
    const [isActive, setIsActive] = useState([]);
    const abi = cashPoints.abi;
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);

    const createCashPointHandler = async () => {
        
    
        await cashPointsContract.addCashPoint();
          
    }

    const getCashPoints = async () => {
    
        if(!ethereum)
        {
          alert('please install metamask');
        }
        else if(ethereum)
        {
          console.log('wallet connected');
    
          let NumberOfCashPointsTXN = await cashPointsContract.count();
          let count = NumberOfCashPointsTXN.toNumber();
          let cashPoints = new Array(count);
          let active = new Array(count);
          for(let i = 1; i <= count; i++)
          {
            let CashPointAddress = await cashPointsContract.keys(i);

            let getCashPoint = await cashPointsContract.getCashPoint(CashPointAddress);
            let now = new Date();
            let cpDate = new Date(getCashPoint._endTime);
            if(cpDate >= now)
            {
                active.push(true);
            }
            else
            {
                active.push(false);
            }

            cashPoints.push(getCashPoint);
            
            
          }

          setIsActive(active);
          getData(cashPoints);
        }
       }
    
       useEffect(() => {
        getCashPoints();
      }, [])

    return(
        <><div className='min-h-screen flex flex-col text-slate-500'>
        <NavBar/>
        <main className=' text-black container mx-auto px-6 pt-16 flex-1 text-left'>
            <h1 className='text-2xl text-slate-800 py-8' >Cash points:</h1>
        <table class="table-auto">
  <thead>
    <tr className='bg-slate-800 text-white' >
      <th>Name</th>
      <th>City</th>
      <th>Phone number</th>
      <th>Currency</th>
      <th>Buy</th>
      <th>Sell</th>
      <th>Active until</th>
    </tr>
  </thead>
  <tbody>
  {data?.map((items,i) =>(
    <tr className={isActive[i]?'bg-green-800 bg-opacity-20 text-left mx-3': 'bg-yellow-600 bg-opacity-20 text-left mx-3'} key={i}>
    <td >
        <a className='mx-3 underline-offset-2 hover:opacity-20 duration-150' href={"https://www.google.com/maps?q="+ethers.utils.formatEther(items._latitude)+","+ethers.utils.formatEther(items._longitude)}>
      {items._name.toString()}
      </a>
    </td>
    <td >
      Some City
    </td>
    <td >
      {items._phoneNumber.toString()}
    </td>
    <td >
      {items._currency.toString()}
    </td>
    <td >
      {ethers.utils.formatEther(items._buy)}
    </td>
    <td >
      {ethers.utils.formatEther(items._sell)}
    </td>
    <td >
      {items._endTime.toString()}
    </td>
    </tr>
   
   ))}

  </tbody>
</table>
<button onClick={createCashPointHandler} className="text-white text-3xl float-right bg-fuchsia-700 mx-20 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            +
          </button>
</main>
        <Footer/>
        </div>
        </>);
}

export default CashPoints;
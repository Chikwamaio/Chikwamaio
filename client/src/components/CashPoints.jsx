import NavBar from './NavBar'
import Footer from './Footer'
import { useState } from 'react';
import { useEffect } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';


const CashPoints = () => {

    const [data, getData] = useState([]);

    const getCashPoints = async () => {
        const abi = cashPoints.abi;
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractAddress = '0xb1DFF8DCD07d903780952aECD09Cb04CDcDC3BE7';
        const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    
        if(!ethereum)
        {
          console.log('wallet not connected');
        }
        else if(ethereum)
        {
          console.log('wallet connected');
    
          let CashPointAddress = await cashPointsContract.keys(1);
          console.log(CashPointAddress);

          let getCashPoint = await cashPointsContract.getCashPoint(CashPointAddress);
          getData(getCashPoint);
        }
       }
    
       useEffect(() => {
        getCashPoints();
      }, [])

    return(
        <><div className='min-h-screen flex flex-col text-slate-500'>
        <NavBar/>
        <main className=' text-black container mx-auto px-6 pt-16 flex-1 text-left'>
            <h1 className='text-2xl text-slate-500 py-8' >Cash points:</h1>
        <table class="table-auto py-12">
  <thead>
    <tr>
      <th>Name</th>
      <th>Latitude</th>
      <th>Longitude</th>
      <th>Phone number</th>
      <th>Currency</th>
      <th>Buy</th>
      <th>Sell</th>
      <th>End Time</th>
      
      <th>isActive</th>
    </tr>
  </thead>
  <tbody>
    <tr>
    {data.map((items,i) =>(
        <td>
      {items.toString()}
      </td>
      ))}
    </tr>
   
    

  </tbody>
</table>
</main>
        <Footer/>
        </div>
        </>);
}

export default CashPoints;
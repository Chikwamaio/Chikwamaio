import NavBar from './NavBar'
import Footer from './Footer'
import { useState } from 'react';
import { useEffect } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';
import Link from '@mui/material/Link';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import AddCashPoint from './AddCashPoint';
import Fade from '@mui/material/Fade';
import { getChipUtilityClass } from '@mui/material';


const CashPoints = () => {

    const [openCreate, setOpenCreate] = useState(false);
    const [isCashPoint, setIsCashPoint] = useState(false);
    const [data, getData] = useState([]);
    const [isActive, setIsActive] = useState([]);
    const abi = cashPoints.abi;
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [walletAddress, setWalletAddress] = useState('')

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

    const handleOpenCreate = async() => {
      const cp = await cashPointsContract.getCashPoint(walletAddress);

      setIsCashPoint(cp._isCashPoint);
      setOpenCreate(true);
    };

    const closeCreate = () => {
      setOpenCreate(false);
    };

    const createCashPointHandler = async (cashPointName, phoneNumber, currency, buyRate, sellRate, duration, fee, lat, long) => {
        
      if(isCashPoint){
        console.table(cashPointName, phoneNumber, currency, buyRate, sellRate, duration, fee, lat, long);
      }
      
      const now = new Date();
      const endtime =  new Date(now.setDate(now.getDate() + duration));
      
      let response = new Array();
      let city;
      const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`);
      response = await res.json();
      city = response.features[0].properties.city + ',' + response.features[0].properties.country;

      const cost = ethers.utils.parseUnits(fee, "ether");

      const addCashPoint = await cashPointsContract.addCashPoint(cashPointName, city, phoneNumber, currency, buyRate, sellRate, endtime.toString(), duration, { value: cost});
      
      setState({
        open: true,
        Transition: Fade,
      });
      setErrorMessage('You have successfully added a cash point ' + addCashPoint);
          
    }

 
    
     
        
 

    const getCashPoints = async () => {
    
        if(!ethereum)
        {
          alert('please install metamask');
        }
        else if(ethereum)
        {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
          setWalletAddress(accounts[0]);
    
          let NumberOfCashPointsTXN = await cashPointsContract.count();
          let count = NumberOfCashPointsTXN.toNumber();
          let cashPoints = new Array(count);
          let active = new Array(count);
          for(let i = 1; i <= count; i++)
          {
            let CashPointAddress = await cashPointsContract.keys(i);

            let CashPoint = await cashPointsContract.getCashPoint(CashPointAddress);
            let now = new Date();
            let cpDate = new Date(CashPoint._endTime);
            if(cpDate >= now)
            {
                active.push(true);
            }
            else
            {
                active.push(false);
            }

            cashPoints.push(CashPoint);

            
            
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
        <NavBar walletAddress={walletAddress}/>
        <main className=' text-black container mx-auto pt-16 flex-1 text-left'>
            <h1 className='text-2xl text-slate-800 py-8' >Find a cash point:</h1>
            
            <Input className='my-6 clear-left' label='Search' startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }/>
        
        <table className="table-auto">
  <thead>
    <tr className='bg-slate-800 text-white text-sm text-center' >
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
        {items._name.toString()}
    </td>
    <td >
      {items.city}
    </td>
    <td >
      {items._phoneNumber.toString()}
    </td>
    <td >
      {items._currency.toString()}
    </td>
    <td >
      {(items._buy).toString()}
    </td>
    <td >
      {(items._sell).toString()}
    </td>
    <td >
      {items._endTime.toString()}
    </td>
    </tr>
   
   ))}

  </tbody>
</table>

+ <Link color="inherit" component='button' href='/cashpoints' onClick={handleOpenCreate}>Add a cash point</Link>
<div>
<AddCashPoint open={openCreate} close={closeCreate} update={isCashPoint} add={createCashPointHandler}></AddCashPoint>
</div>
</main>

        <Footer/>
       </div>
        </>);
}

export default CashPoints;
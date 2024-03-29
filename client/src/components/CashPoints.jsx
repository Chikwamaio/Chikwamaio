import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Fade from '@mui/material/Fade';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import AddCashPoint from './AddCashPoint';
import NavBar from './NavBar';


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
        

      const now = new Date();
      const endtime =  new Date(now.setDate(now.getDate() + duration));
      let response = new Array();
      let city;


      var requestOptions = {
        method: 'GET',
      };
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`, requestOptions);
      response = await res.json();
      city = response.results[0].address_components[2].long_name + ', ' + response.results[0].address_components[4].long_name;
      const cost = ethers.utils.parseUnits(fee, "ether");


      if(isCashPoint){  

        const CashPoint = await cashPointsContract.getCashPoint(walletAddress);
        const currentEndtime = new Date(Date.parse(CashPoint._endTime));
        const now = new Date()
        const IsActive = currentEndtime > now;
        const newEndtime = IsActive ? new Date(currentEndtime.setDate(currentEndtime.getDate() + duration)) : new Date(now.setDate(now.getDate() + duration));
        if(city){
        const updateCashPoint = await cashPointsContract.updateCashPoint(cashPointName, city, phoneNumber, currency, buyRate, sellRate, newEndtime.toString(), duration, { value: cost});

        return;  
      }

      console.log('failed to access your location');
        return;
      }
      
      
      
      
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
          
          let cashPoints = [];
          let active = [];
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
{data?.map((items,i) =>(
  isActive[i] &&(
<Card sx={{ maxWidth: 345, margin:'5px'}} key={i}>
  <CardHeader title={items._name}></CardHeader>
      <CardContent>
        <Typography >
        <LocationOnIcon/> {(items.city)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        Currency: {(items._currency)}
        </Typography>

        <Typography variant="body2">
        Buy: {(items._buy).toString()}
        Sell: {(items._sell).toString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        Valid Until: {(items._endTime)}
        </Typography>

        <Typography variant="body2">
        <PhoneIcon/> {(items._phoneNumber).toString()}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      </CardActions>
    </Card>)
 ))}

+ <Link color="inherit" component='button' href='/cashpoints' onClick={handleOpenCreate}>Add a cash point</Link>
<div>
<AddCashPoint open={openCreate} close={closeCreate} update={isCashPoint} add={createCashPointHandler}></AddCashPoint>
</div>
</main>

       </div>
        </>);
}

export default CashPoints;
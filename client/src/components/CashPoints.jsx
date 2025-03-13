import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PhoneIcon from '@mui/icons-material/Phone';
import {  Box, Card, CardActions, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Link, Stack, TextField, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { ethers } from 'ethers';
import { Feature, Map, View } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { useEffect, useRef, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import NavBar from './NavBar';
import AddCashPoint from './AddCashPoint';
import SendMoney from './SendMoney';
import CashIn from './CashIn';
import { SocialMediaModal } from './SocialMediaModal';
import { renderMetaMaskPrompt } from './InstallMetaMask';

const CashPoints = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openSocialModal, setOpenSocialModal] = useState(false);
    const [isCashPoint, setIsCashPoint] = useState(false);
    const [data, getData] = useState([]);
    const [isActive, setIsActive] = useState([]);
    const [walletAddress, setWalletAddress] = useState('');
    const [state, setState] = useState({ open: false, Transition: Fade });
    const [errorMessage, setErrorMessage] = useState('');
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
    const [openEmailModal, setOpenEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');

    const abi = cashPoints.abi;
    const { ethereum } = window;
    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;
    const signer = provider?.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const emailScriptURL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_WEB_APP_URL;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [daiBalance, setDaiBalance] = useState();
    const [uniqueCities, setUniqueCities] = useState([]);
    const [shareMessage, setShareMessage] = useState(''); 
    const [currentCashPoint, setCurrentCashPoint] = useState(null);
    const [cardPosition, setCardPosition] = useState(null);
    const [openSend, setOpenSend] = useState(false);
    const [openCashIn, setOpenCashIn] = useState(false);

    const mapRef = useRef(null);
    useEffect(() => {

        const vectorSource = new VectorSource();
        const cps = data;

    
        cps.forEach((cp, index) => {

          const lat = parseFloat(ethers.utils.formatEther(cp[2] || "0")); 
          const long = parseFloat(ethers.utils.formatEther(cp[3] || "0"));
          const buyRate = parseFloat(ethers.utils.formatEther(cp[7] || "0")).toFixed(2);
          const sellRate = parseFloat(ethers.utils.formatEther(cp[8] || "0")).toFixed(2);

        const coords= [long, lat];

          const CashPoint = new Feature({
            geometry: new Point(fromLonLat(coords)),
            name: cp[0],
            address: cp.address,
            phoneNumber: cp[5],
            currency: cp._currency,
            buyRate: buyRate,
            sellRate: sellRate,
            until: cp[9],
            city: cp.city,
          });

          CashPoint.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: '/icons8-marker-94.png',
                scale: 0.25,
              }),
            })
          );
          if(isActive[index]){
          vectorSource.addFeature(CashPoint);
          }
        });
    
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });
    
        const map = new Map({
          target: mapRef.current || undefined,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
            vectorLayer,
          ],
          view: new View({
            center: fromLonLat([35, -15]),
            zoom: 6,
          }),
          controls: defaultControls(),
        });
    



        map.on('click', (evt) => {
          const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

          if (feature) {
            const geometry = feature.getGeometry()?.getCoordinates() || [];
            const transformedCoordinates = toLonLat(geometry);
            const [longitude, latitude] = transformedCoordinates;
            setCurrentCashPoint({
                address: feature.get('address'),
                name: feature.get('name'),
                city: feature.get('city'),
                phoneNumber: feature.get('phoneNumber'),
                currency: feature.get('currency'),
                buyRate: feature.get('buyRate'),
                sellRate: feature.get('sellRate'),
                until: feature.get('until'),
                geometry: [longitude, latitude],
            });
            setCardPosition({
              top: evt.pixel[1],
              left: evt.pixel[0],
            });
            
          } else {
            setCurrentCashPoint(null);
          }
        });


        const parentDiv = document.getElementById("zoomtolausanne"); 
        const spans = parentDiv?.querySelectorAll("span.MuiChip-label"); 

        if(spans){
        spans.forEach((span) => {
          span.addEventListener('click', () => {
            const city = span.textContent; 
            
            const cp = cps.find((cp) => cp.city.split(',')[0].trim() === city);
            if (cp && cp[2] !== undefined && cp[3] !== undefined)  {
              const lat = parseFloat(ethers.utils.formatEther(cp[2] || '0')); 
              const long = parseFloat(ethers.utils.formatEther(cp[3] || '0'));

              const coords = [long, lat];
              const location = new Feature({ geometry: new Point(fromLonLat(coords)) });
              const point = location.getGeometry();
              const size = map.getSize();
              const view = map.getView();
              const coordinates = point?.getCoordinates();

              if (coordinates && size) {
                view.centerOn(coordinates, size, [500, 200]);

              }
            } else {
              console.warn(`City "${city}" not found in data.`);
            }
          });
        });
        }
        return () => {
          map.setTarget('');
        };
     
    }, [data]);

    const sendMoneyHandler = async (toAddress, amount, fee) => {
        if (!ethers.utils.isAddress(toAddress)) {
          setState({
            open: true,
            Transition: Fade,
          });
          setErrorMessage("Invalid address. Please check the recipient address.");
          return;
        }


        const message = `I just converted my crypto dollars to money I can use here in ${currentCashPoint?.city}, thanks to Chikwama! Check it out at https://chikwama.net or follow @chikwamaio.`;
      setShareMessage(message);
      
        const balance = await provider.getBalance(currentAccount);
        const address = toAddress;
        const amountEther = ethers.utils.parseUnits(amount, "ether");
        const feeEther = ethers.utils.parseUnits(fee, "ether");
        const totalCost = amountEther.add(feeEther);
      
        if (balance < totalCost) {
          setState({
            open: true,
            Transition: Fade,
          });
          setErrorMessage(
            `You have less than $${ethers.utils.formatEther(
              totalCost
            )} in your wallet ${currentAccount}`
          );
          return;
        }
      
        try {
          const sendXdai = await cashPointsContract.send(amountEther, address, {
            value: ethers.BigNumber.from(totalCost.toString()),
          });
      
          setState({
            open: true,
            Transition: Fade,
          });
          setErrorMessage(`Transaction successful: ${sendXdai.toString()}`);
        } catch (error) {
          setState({
            open: true,
            Transition: Fade,
          });
          setErrorMessage(`Transaction failed: ${error.message}`);
        }
      };
    

    useEffect(() => {
        const cities = data
          .filter((_, index) => isActive[index]) 
          .map((entry) => entry.city.split(",")[0].trim()); 
      
        const unique = Array.from(new Set(cities)); 
      
        setUniqueCities(unique);
        console.log("Updated uniqueCities state:", uniqueCities);
      }, [data, isActive]); 


    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleOpenCreate = async () => {
        if(provider){
        const cp = await cashPointsContract.getCashPoint(walletAddress);
        setIsCashPoint(cp._isCashPoint);
        setOpenCreate(true);
    }
    };

    const closeCreate = () => {
        setOpenCreate(false);
    };

    const closeSend = () => {
        setOpenSend(false);
      };
  
      const closeCashIn = () => {
        setOpenCashIn(false);
      };

    const createCashPointHandler = async (cashPointName, phoneNumber, currency, buyRate, sellRate, duration, fee, lat, long, Accuracy) => {
      const now = new Date();
      const endtime =  new Date(now.setDate(now.getDate() + duration));
      const scaledLat= ethers.utils.parseUnits(lat.toString(), "ether");
      const scaledLong = ethers.utils.parseUnits(long.toString(), "ether");
      const scaledAccuracy = ethers.utils.parseUnits(Accuracy.toString(), "ether");
      console.log(scaledAccuracy, scaledLat, scaledLong)
      let response = new Array();
      let city;

      if(fee > daiBalance){
        setState({
            open: true,
            Transition: Fade,
          });
          setErrorMessage('You do not have enough funds to complete this transaction');
          return;
      }

      var requestOptions = {
        method: 'GET',
      };
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`, requestOptions);
      response = await res.json();
      console.log(response)
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

        setState({
            open: true,
            Transition: Fade,
          });
          setErrorMessage('You have successfully added a cash point ' + updateCashPoint);
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
    };

    const getCashPoints = async () => {
        let checkIfRegistered;
        try {
           checkIfRegistered = await cashPointsContract.cashpoints(walletAddress.toString());
            setIsCashPoint(checkIfRegistered._isCashPoint);
    
        } catch (error) {
            console.error("Error fetching cashpoint:", error);
        }
        
        if(!provider){
        
            setIsMetaMaskInstalled(false);
            return;
        }

        if (!ethereum) {
            alert('please install metamask');
        } else {

            

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setWalletAddress(accounts[0]);

            const DaiBalance = await provider.getBalance(accounts[0])
            setDaiBalance(ethers.utils.formatEther(DaiBalance));

            let NumberOfCashPointsTXN = await cashPointsContract.count();
            let count = NumberOfCashPointsTXN.toNumber();

            let registeredCashPoints = [];
            let active = [];
            for (let i = 1; i <= count; i++) {
     
                let CashPointAddress = await cashPointsContract.keys(i);
                let CashPoint = await cashPointsContract.getCashPoint(CashPointAddress);
                let now = new Date();
                let cpDate = new Date(CashPoint._endTime);
                active.push(cpDate >= now);
                registeredCashPoints.push({
                  ...CashPoint,
                  address: CashPointAddress,
              });
            }
            setIsActive(active);
            getData(registeredCashPoints);

        }
    };

    

    useEffect(() => {
        getCashPoints();
    }, []);

    // Modal to capture user email and location
    const handleEmailModalOpen = () => {
        setOpenEmailModal(true);
    };

    const handleEmailModalClose = () => {
        setOpenEmailModal(false);
    };

    const handleSocialClose = ()=>{

    };

    const handleEmailSubmit = async () => {
        const scriptURL = emailScriptURL; 
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ email, location }),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log(result); // Should log "Success"
            setOpenEmailModal(false);
        } catch (error) {
            console.error('Error submitting email:', error);
            setOpenEmailModal(false);
        }
    };

    return isMetaMaskInstalled ? (
        <div className='min-h-screen flex flex-col text-slate-500'>
            <NavBar walletAddress={walletAddress} walletBalance={daiBalance}/>
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
            <main className='text-black container mx-auto pt-16 flex-1 text-left'>
            
                    <h4 className='text-xl text-slate-700 lg:text-2xl uppercase text-left py-6'>Find a cashpoint:</h4>
                    {isCashPoint && <p className='text-slate-700 mb-2'>Welcome back! You're signed in as <b>{username}</b> cashpoint.</p>}
                    <Stack
                    id="zoomtolausanne" 
      direction="row"
      spacing={2}
      sx={{ margin: "20px", flexWrap: "wrap", gap: 1 }}
    >
      {uniqueCities.map((city, index) => (
        <Chip key={index} label={city} color="secondary" variant="outlined" clickable/>
      ))}
    </Stack>
            <div id="map" ref={mapRef} style={{ width: '100%', height: '500px' }} />
            <div className="flex justify-center">
                <button className="z-100 text-white bg-[#872A7F] mb-2 mt-2 py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-[#872A7F] hover:border hover:border-[#872A7F] focus:outline-none focus:ring" onClick={handleOpenCreate}>
                    {isCashPoint?"Update Cashpoint details!":"Become a Cashpoint!"}
                </button>
                {isCashPoint &&<button onClick={handleCashIn} className="z-100 text-white bg-[#872A7F] ml-2 mb-2 mt-2 py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-[#872A7F] hover:border hover:border-[#872A7F] focus:outline-none focus:ring">Cash In!</button>}
            </div>
{currentCashPoint && cardPosition && (
  <Card 
  sx={{ 
    maxWidth: 400, 
    position: 'absolute', 
    top: cardPosition.top, 
    left: cardPosition.left, 
    zIndex: 1000, 
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', 
    borderRadius: 3, 
    padding: 2 
  }}
>
  <CardHeader

  title={currentCashPoint.name}
/>
  <CardContent>
  <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
      <img
        src="/cp_image.jpg"
        alt="Chikwama Cashpoint Sticker"
        style={{ width: '100%', maxWidth: '350px', borderRadius: 5 }}
      />
    </Box>
    <Typography>
      <LocationOnIcon />{' '}
        <span style={{ fontFamily: 'Digital-7, monospace' }}>{currentCashPoint.city}</span>
    </Typography>
    <Typography variant="body2" color="text.secondary">
      <span>Currency:</span>{' '}
      <span style={{ fontFamily: 'Digital-7, monospace' }}>{currentCashPoint.currency}</span>
    </Typography>
    <Typography variant="body2">
      <span>Buy:</span>{' '}
      <span style={{ fontFamily: 'Digital-7, monospace' }}>{currentCashPoint.buyRate}</span>{' '}
      <span>Sell:</span>{' '}
      <span style={{ fontFamily: 'Digital-7, monospace' }}>{currentCashPoint.sellRate}</span>
    </Typography>
    <Typography variant="body2" color="text.secondary">
      <span>Valid Until:</span>{' '}
      <span style={{ fontFamily: 'Digital-7, monospace' }}>{currentCashPoint.until}</span>
    </Typography>
    <Typography variant="body2">
      <PhoneIcon />{' '}
      <span style={{ fontFamily: 'Digital-7, monospace' }}>{currentCashPoint.phoneNumber}</span>
    </Typography>
  </CardContent>
  <CardActions>
    <button 
      className="text-white bg-[#872A7F] py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-[#872A7F] hover:border hover:border-[#872A7F] focus:outline-none focus:ring"
      onClick={() => { setOpenSend(true); }}
    >
      <AccountBalanceWalletIcon /> 
      CASH OUT
    </button>
  </CardActions>
</Card>
            )}
            
       <AddCashPoint open={openCreate} close={closeCreate} update={isCashPoint} add={createCashPointHandler}></AddCashPoint>
       <SendMoney open={openSend} close={closeSend} send={sendMoneyHandler} cashPoint={currentCashPoint} account={walletAddress}></SendMoney>
       <CashIn open={openCashIn} close={closeCashIn} send={sendMoneyHandler} cashPoint={currentCashPoint} account={walletAddress}></CashIn>
                <div className='my-4'>
                    <Link className='text-[#872A7F] ' color="inherit" component='button' onClick={handleEmailModalOpen}>
                        Can’t find a cash point at your desired location?
                    </Link>
                </div>
  
                <Dialog open={openEmailModal} onClose={handleEmailModalClose}>
                    <DialogTitle>Leave your email and location</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                      We will let you know when we have a cashpoint available at your desired location.
                    </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="location"
                            label="Desired Location"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button onClick={handleEmailModalClose}>Cancel</button>
                        <button onClick={handleEmailSubmit}>Submit</button>
                    </DialogActions>
                </Dialog>
 
                <SocialMediaModal
  open={openSocialModal}
  onClose={()=>setOpenSocialModal(false)}
  message={shareMessage}
/>
            </main>
        </div>
    ): (
        renderMetaMaskPrompt()
    );
};

export default CashPoints;
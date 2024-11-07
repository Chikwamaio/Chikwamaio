import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Link, TextField, Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { ethers } from 'ethers';
import { Feature, Map, View } from 'ol';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { useEffect, useRef, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import AddCashPoint from './AddCashPoint';
import NavBar from './NavBar';
import SendMoney from './SendMoney';

const CashPoints = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const [isCashPoint, setIsCashPoint] = useState(false);
    const [data, getData] = useState([]);
    const [isActive, setIsActive] = useState([]);
    const [walletAddress, setWalletAddress] = useState('');
    const [state, setState] = useState({ open: false, Transition: Fade });
    const [errorMessage, setErrorMessage] = useState('');
    
    // State for the email modal
    const [openEmailModal, setOpenEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');

    const abi = cashPoints.abi;
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const emailScriptURL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_WEB_APP_URL;
    const cashPointsContract = new ethers.Contract(contractAddress, abi, signer);
    const [cardPosition, setCardPosition] = useState(null);
    const [openSend, setOpenSend] = useState(false);
    const [currentCashPoint, setCurrentCashPoint]= useState(null);

    const mapRef = useRef();


    const closeSend = () => {
      setOpenSend(false);
    };
    const sendMoneyHandler = async (amount, fee, gasFee) => {
    
      const balance = await provider.getBalance(walletAddress);
      const address = currentCashPoint.address;
      const amountEther = ethers.utils.parseUnits(amount, "ether");
      const feeEther = ethers.utils.parseUnits(fee, "ether");
      const gasFeeEther = ethers.utils.parseUnits(gasFee, "ether");
      const totalCost = amountEther.add(feeEther).add(gasFeeEther);
      if (balance.lt(totalCost)) {
        setState({
          open: true,
          Transition: Fade,
        });
        setErrorMessage(
          `You have less than $${ethers.utils.formatEther(
            totalCost
          )} in your wallet ${walletAddress}`
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
      const vectorSource = new VectorSource();
      const cps = [
        { city: 'Blantyre, Malawi', coordinates: [34.995, -15.786], cashPointName: 'Alpha', address: '0x54910e51713295dE5428470837930a6E35A41967', phoneNumber:'+265 999 999 999', currency:'MWK', buyRate: 1700, sellRate:2000, until: '2025-01-01'},
        { city: 'Lilongwe, Malawi', coordinates: [33.7741, -13.9626], cashPointName: 'Beta', address: '0x54910e51713295dE5428470837930a6E35A41967', phoneNumber:'+265 999 999 888', currency:'MWK', buyRate: 1800, sellRate:2000, until: '2025-01-01'},
        // Add other cities...
      ];
  
      cps.forEach((cp) => {
        const CashPoint = new Feature({
          geometry: new Point(fromLonLat(cp.coordinates)),
          name: cp.cashPointName,
          address: cp.address,
          phoneNumber: cp.phoneNumber,
          currency: cp.currency,
          buyRate: cp.buyRate,
          sellRate: cp.sellRate,
          until: cp.until,
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
        vectorSource.addFeature(CashPoint);
      });
  
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
  
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([25, 5]),
          zoom: 3,
        }),
      });
  
      // Display popover on feature click
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        if (feature) {
          setCurrentCashPoint(feature.values_);
          const coordinates = feature.getGeometry().getCoordinates();
          setCardPosition({
            top: evt.pixel[1],
            left: evt.pixel[0],
          });
        } else {
          setCurrentCashPoint(null);
        }
      });
  
      // Cleanup on component unmount
      return () => {
        map.setTarget(null);
      };
    }, []);

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const handleOpenCreate = async () => {
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
    };

    const getCashPoints = async () => {
        if (!ethereum) {
            alert('please install metamask');
        } else {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setWalletAddress(accounts[0]);

            let NumberOfCashPointsTXN = await cashPointsContract.count();
            let count = NumberOfCashPointsTXN.toNumber();

            let cashPoints = [];
            let active = [];
            for (let i = 1; i <= count; i++) {
                let CashPointAddress = await cashPointsContract.keys(i);
                let CashPoint = await cashPointsContract.getCashPoint(CashPointAddress);
                let now = new Date();
                let cpDate = new Date(CashPoint._endTime);
                active.push(cpDate >= now);
                cashPoints.push(CashPoint);
            }
            setIsActive(active);
            getData(cashPoints);
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

    const handleEmailSubmit = async () => {
        const scriptURL = emailScriptURL; 
        console.log(email,location);
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

    return (
        <div className='min-h-screen flex flex-col text-slate-500'>
            <NavBar walletAddress={walletAddress} />
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
                <h1 className='text-2xl text-slate-800'>Find a cash point:</h1>
                <div id="map" ref={mapRef} style={{ width: '100%', height: '500px' }} />
                {currentCashPoint && cardPosition && (
                <Card sx={{ maxWidth: 500, position: 'absolute', top: cardPosition.top, left: cardPosition.left, zIndex: 1000 }}>
                    <CardHeader title={currentCashPoint.name} />
                    <CardContent>
                        <Typography>
                            <LocationOnIcon /> {currentCashPoint.city}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Currency: {currentCashPoint.currency}
                        </Typography>
                        <Typography variant="body2">
                            Buy: {currentCashPoint.buyRate} Sell: {currentCashPoint.sellRate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Valid Until: {currentCashPoint.until}
                        </Typography>
                        <Typography variant="body2">
                            <PhoneIcon /> {currentCashPoint.phoneNumber}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => setOpenSend(true)}>Withdraw</Button>
                    </CardActions>
                </Card>
            )}
                <AddCashPoint open={openCreate} close={closeCreate} update={isCashPoint} add={createCashPointHandler}></AddCashPoint>
                <div className='my-4'>
                    <Link className='text-fuchsia-700' color="inherit" component='button' onClick={handleEmailModalOpen}>
                        Can’t find a cash point at your desired location?
                    </Link>
                </div>
                <SendMoney open={openSend} close={closeSend} send={sendMoneyHandler} cashPoint={currentCashPoint}></SendMoney>
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
                        <Button onClick={handleEmailModalClose}>Cancel</Button>
                        <Button onClick={handleEmailSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
};

export default CashPoints;
import { Add } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Fade, Link, TextField } from '@mui/material';
import { ethers } from 'ethers';
import { Feature, Map, View } from 'ol';
import { Point } from 'ol/geom';
import { Modify } from 'ol/interaction.js';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';
import { useEffect, useState } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import AddCashPoint from './AddCashPoint';
import NavBar from './NavBar';

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


    useEffect(() => {
      const cities = [
        { name: 'Blantyre, Malawi', coordinates: [34.995, -15.786] },
        { name: 'Lilongwe, Malawi', coordinates: [33.7741, -13.9626] },
        { name: 'Mzuzu, Malawi', coordinates: [34.0149, -11.4656] },
        { name: 'Zomba, Malawi', coordinates: [35.308, -15.385] },
        { name: 'Mangochi, Malawi', coordinates: [34.4686, -14.4781] },
        { name: 'Kasungu, Malawi', coordinates: [33.4767, -13.035] },
        { name: 'Salima, Malawi', coordinates: [34.458, -13.7804] },
      ];
      const vectorSource = new VectorSource();
    
      cities.forEach((city) => {
        const cityPoint = new Feature({
          geometry: new Point(fromLonLat(city.coordinates)),
          name: city.name,
        });
    
        const pointStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: '/icons8-marker-94.png', // Ensure the icon path is correct
            scale: 0.25,
          }),
        });
    
        cityPoint.setStyle(pointStyle);
        vectorSource.addFeature(cityPoint);
      });
    
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
    
      // Initialize the map
      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer, // Add the vector layer with city points
        ],
        view: new View({
          center: fromLonLat([25, 5]), // Center the map
          zoom: 3,
        }),
      });
    
      // Create a Modify interaction to enable modifying the vector points
      const modify = new Modify({ source: vectorSource });
    
      // Add Modify interaction to the map
      map.addInteraction(modify);
    
      modify.on('modifystart', (evt) => {
        document.getElementById('map').style.cursor = 'grabbing';
      });
    
      modify.on('modifyend', (evt) => {
        document.getElementById('map').style.cursor = 'pointer';
      });
    
      return () => {
        // Clean up map instance on component unmount
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

            <main className='text-black container mx-auto pt-16 flex-1 text-left'>
                <h1 className='text-2xl text-slate-800'>Find a cash point:</h1>
                <div id="map" style={{ width: '98%', height: '600px'}}>

                <div className='my-4'>
                <Fab aria-label="add" className="fixed bottom-5 right-8 bg-fuchsia-700 hover:bg-white" onClick={handleOpenCreate}>
                    <Add sx={{ color: 'white', '&:hover': { color: 'purple' }}}/>
                </Fab>
                </div>
                <div>
                <AddCashPoint open={openCreate} close={closeCreate} update={isCashPoint} add={createCashPointHandler}></AddCashPoint>
              </div>
                </div>
                
                <div className='my-4'>
                    <Link className='text-fuchsia-700' color="inherit" component='button' onClick={handleEmailModalOpen}>
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
                        <Button onClick={handleEmailModalClose}>Cancel</Button>
                        <Button onClick={handleEmailSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
};

export default CashPoints;
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Link, TextField } from '@mui/material';
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
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
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
    const [popoverContent, setPopoverContent] = useState({ title: '', body: '' });
    const [showPopover, setShowPopover] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState(null);
    
    const mapRef = useRef();
    const popupRef = useRef();

    useEffect(() => {
      const vectorSource = new VectorSource();
      const cities = [
        { name: 'Blantyre, Malawi', coordinates: [34.995, -15.786] },
        { name: 'Lilongwe, Malawi', coordinates: [33.7741, -13.9626] },
        // Add other cities...
      ];
  
      cities.forEach((city) => {
        const cityPoint = new Feature({
          geometry: new Point(fromLonLat(city.coordinates)),
          name: city.name,
        });
        cityPoint.setStyle(
          new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: '/icons8-marker-94.png',
              scale: 0.25,
            }),
          })
        );
        vectorSource.addFeature(cityPoint);
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
          const coordinates = feature.getGeometry().getCoordinates();
          setPopoverContent({
            title: feature.get('name'),
            body: `Location: ${feature.get('name')}`,
          });
          setPopoverPosition({
            top: evt.pixel[1],
            left: evt.pixel[0],
          });
          setShowPopover(true);
        } else {
          setShowPopover(false);
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

            <main className='text-black container mx-auto pt-16 flex-1 text-left'>
                <h1 className='text-2xl text-slate-800'>Find a cash point:</h1>
                <div id="map" ref={mapRef} style={{ width: '100%', height: '500px' }} />
                
                {showPopover && (
                    <OverlayTrigger
                      trigger="click"
                      placement="top"
                      overlay={
                        <Popover id="popover-basic"       style={{
                          position: 'absolute',
                          top: `${popoverPosition.top}px`,
                          left: `${popoverPosition.left}px`,
                          backgroundColor: '#e0f7e9',
                          color: '#333',
                          border: '1px solid #28a745',
                          zIndex: 1000,
                        }}>
                          <Popover.Header as="h3">{popoverContent.title}</Popover.Header>
                          <Popover.Body>{popoverContent.body}</Popover.Body>
                          <Button>Withdraw</Button>
                        </Popover>
                      }
                      show={showPopover}
                      target={() => mapRef.current}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: `${popoverPosition.center}px`,
                          left: `${popoverPosition.left}px`,
                        }}
                      />
                    </OverlayTrigger>
                )}
                <AddCashPoint open={openCreate} close={closeCreate} update={isCashPoint} add={createCashPointHandler}></AddCashPoint>
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
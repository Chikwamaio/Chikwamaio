import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FastForwardIcon from '@mui/icons-material/FastForward';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LockIcon from '@mui/icons-material/Lock';
import RoomIcon from '@mui/icons-material/Room';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const { ethereum } = window;
    const navigate = useNavigate();

    useEffect(() => {
        if (ethereum) navigate('/Home');
    }, []);

    const steps = [
        {
            label: "Get a MetaMask Wallet",
            description: "To start using Chikwama, get yourself a MetaMask wallet. If you don't have one, it's easy to set up. Simply visit the MetaMask website and download the app.",
            icon: <AccountBalanceIcon />,
            button: true,  // Add a flag for showing the button
        },
        {
            label: "Find a Cashpoint",
            description: "Go to the cash points page and check if there is a nearby cashpoint where you are from. Chikwama offers cashpoints where you can convert your cryptocurrency to local money.",
            icon: <RoomIcon />,
        },
        {
            label: "Buy Bitcoin (BTC)",
            description: "Get some Bitcoin (BTC). If you don’t already own Bitcoin, buy it from any exchange or platform that supports it.",
            icon: <LockIcon />
        },
        {
            label: "Convert BTC to DOC",
            description: "Go to Sovryn to convert your Bitcoin (BTC) to Dollar on Chain (DOC). Click this box to visit SOVRYN",
            icon: <AttachMoneyIcon/>,
            link: "https://sovryn.app/convert?from=BTC&to=DOC"
        },
        {
            label: "Send the Value Home",
            description: "Once you have DOC, send the equivalent value home through Chikwama, where it will be ready for conversion into local currency.",
            icon: <LockIcon />
        },
        {
            label: "Pick a Convenient Cashpoint",
            description: "Tell the people at home to find the cheapest and most convenient Chikwama cashpoint. They can then convert the DOC into money they can use easily.",
            icon: <RoomIcon />
        },
    ];

    return (
        <div className="md:px-20 bg-slate-100 md:py-12 py-6 px-4 lg:px-32 xl:px-40">
            <h2 className='md:text-3xl text-3xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
            <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>

            {/* Timeline-style visual component */}
            <div className="py-4">
                <p className='py-4 text-slate-700'>How Chikwama Works:</p>
                
                {/* Grid layout for steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((step, index) => (
                    
                        <div
                            key={index}
                            className="relative p-6 rounded-lg shadow-lg bg-yellow-100 hover:bg-yellow-200 transition-all"
                        >
                                 <a
                         key={index}
                         href={step.link}
                         target="_blank"
                         rel="noopener noreferrer"
                        
                     >
                            {/* Step Number */}
                            <div className="absolute bg-[#872A7F] top-0 left-0 -mt-2 -ml-2 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                                {index + 1}
                            </div>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-700">{step.label}</h3>
                            </div>
                            <p className="text-slate-700">{step.description}</p>
                            {/* Render button only for "Get a MetaMask Wallet" step */}
                            {step.label === "Get a MetaMask Wallet" && step.button && (
    <div className="flex justify-center mt-4">
        <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#FDE20D] text-black px-6 py-3 rounded-md text-md font-semibold hover:bg-[#872A7F] hover:text-white transition duration-300 ease-in-out">
                Get MetaMask
            </button>
        </a>
    </div>
)}
 </a>
                        </div>
                    ))}
                </div>
            </div>

            <p className='py-4 text-slate-700'>Why use Chikwama?</p>
            <ul className='list-disc pl-8'>
    <li className='text-slate-700 flex items-center py-2'>
        <FastForwardIcon className="mr-2 text-yellow-400" />
        <p><b>Fast Transactions:</b> Crypto is one of the fastest ways to send money today. Whether you’re sending funds across the globe or across town, your transactions are completed in minutes, not days.</p>
    </li>
    <li className='text-slate-700 flex items-center py-2'>
        <EventAvailableIcon className="mr-2 text-yellow-400" />
        <p><b>24/7 Availability:</b> Unlike traditional banking services that are restricted to office hours, Chikwama is available anytime. Send money whenever you need it—no waiting for business hours or banking holidays.</p>
    </li>
    <li className='text-slate-700 flex items-center py-2'>
        <RoomIcon className="mr-2 text-yellow-400" />
        <p><b>Find Cashpoints:</b> Locate nearby cashpoints where you can convert stablecoins, like Dollar on Chain (DOC), to local currency effortlessly.</p>
    </li>
    <li className='text-slate-700 flex items-center py-2'>
        <LockIcon className="mr-2 text-yellow-400" />
        <p><b>Self-Custodial:</b> Chikwama ensures that you have control over your funds, providing a secure, self-custodial experience.</p>
    </li>
    <li className='text-slate-700 flex items-center py-2'>
        <AttachMoneyIcon className="mr-2 text-yellow-400" />
        <p><b>Nominal Fee:</b> Chikwama charges a nominal fee of 1% for providing the cashpoint conversion service.</p>
    </li>
</ul>

            <p className='py-4 text-slate-700'>
                If you have any questions or need help getting started with Chikwama, please don't hesitate to <a href="mailto:info@chikwama.net" className='text-fuchsia-700'>reach out to us</a>.
            </p>

            {/* Social media links */}
            <div className="flex space-x-4 pt-4">
                <a href="https://www.linkedin.com/in/chikwama" target="_blank" rel="noopener noreferrer">
                    <LinkedInIcon className="text-blue-700" />
                </a>
                <a href="https://twitter.com/chikwamaio" target="_blank" rel="noopener noreferrer">
                    <TwitterIcon className="text-blue-500" />
                </a>
                <a href="https://www.youtube.com/@ChikwamaDAO" target="_blank" rel="noopener noreferrer">
                    <YouTubeIcon className="text-red-600" />
                </a>
            </div>
        </div>
    );
}

export default LandingPage;
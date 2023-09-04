import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {


    const { ethereum } = window;
    const navigate = useNavigate();

    useEffect(() => {
        ethereum?navigate('/Home'):null;
        
      }, []);
  return (
    <div>
      <h2 className='md:text-3xl text-3xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
      <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
      <p className='text-slate-700'>To use the app you need to install <a className='text-fuchsia-700' href='https://metamask.io/'>MetaMask</a>(or another ethereum compatible client), which allows you to securely interact with <a className='text-fuchsia-700' href='https://www.gnosis.io/'>Gnosis</a>-based applications like ours.</p>
      <p className='py-4 text-slate-700'>If you're using a desktop or laptop computer, you can install MetaMask as a browser extension for Google Chrome, Firefox, or Brave. If you're using a mobile device, you can download MetaMask Mobile from the App Store or Google Play.</p>
      <p className='py-4 text-slate-700'>If you have any questions or need help getting started with MetaMask, please don't hesitate to reach out to us.</p>
      </div>
  );
}

export default LandingPage;
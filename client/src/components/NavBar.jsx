import { useState } from 'react';
import { useEffect } from 'react';
import chikwamaLogo from '../assets/Icon100.png';
import { ethers } from 'ethers';

const downloadApp = () => {

    window.location.href = 'https://testflight.apple.com/join/MTNmiNCj';

  }

const connectWalletHandler = async () => 
{
    const { ethereum } = window;

    if(!ethereum)
    {
      console.log('please install metamask');
    }

      try 
      {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
          console.log(accounts[0]);
      }
      catch(error)
      {
        console.log(error);
      }
      
}

const connectWalletButton = () => 
{
        return (
          <button onClick={connectWalletHandler} className="text-white bg-fuchsia-700 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            Connect
          </button>
        )
}
const sendButton = () => 
{
        return (
          <button onClick={connectWalletHandler} className="text-white bg-fuchsia-700 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring">
            Send
          </button>
        )
}


const NavBar = () => {

    return(
        <>
        <header className="flex flex-row items-center justify-between drop-shadow-md py-2 px-5 bg-white max-w-full min-w-fit max-h-full pr-2">
        <a href="/Home" className="flex flex-row justify-center items-center cursor-pointer uppercase">
        <img
          className="w-6 h-6 object-contain cursor-pointer"
          src={chikwamaLogo}
          alt="Chikwama Logo"
        />
        <span>Chikwama</span>
      </a>
      <nav className="flex flex-row justify-center items-center list-none px-6 overflow-x-clip">
        <li className="cursor-pointer mr-3 hover:text-fuchsia-700">Cashpoints</li>
        <li className="cursor-pointer mr-3 hover:text-fuchsia-700 content-center">{sendButton()}</li>
        <li className="cursor-pointer mr-3 hover:text-fuchsia-700 content-center">{connectWalletButton()}</li>
      </nav>
      
      </header>
      </>
    );
     
};

export default NavBar;
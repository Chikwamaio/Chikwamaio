import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import chikwamaLogo from '../assets/Icon100.png';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const NavBar = ({walletAddress, walletBalance}) => {
  let [menuOpen, setMenuOpen] = useState(false);
  const address = walletAddress;
  const tokenBalance = Number(walletBalance).toFixed(2);
  const handleOpenMenu = () =>
  {
    setMenuOpen(!menuOpen);
  }

    return (
      <>
        <div className="bg-white shadow-md md:pl-24 md:pr-24 fixed top-0 left-0 w-full z-50">
          <div className="md:flex items-center justify-between bg-white py-4 md:px-2 px-2">
            <div>
              <a href="/Home" className="cursor-pointer uppercase">
                <span className="mr-1 pt-2">
                  <img
                    className="h-10 inline"
                    src={chikwamaLogo}
                    alt="Chikwama Logo"
                  />
                </span>
                Chikwama
              </a>
            </div>
            <div className="text-3xl absolute right-8 top-4 cursor-pointer">
              <span className="text-3xl cursor-pointer md:hidden block inline">
                <IconButton onClick={handleOpenMenu}>
                  {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </span>
            </div>
            <div>
              <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 md:pt-0 pt-6 transition-all duration-500 ease-in ${menuOpen ? 'top-20 opacity-100' : 'hidden'}`}>
                <li className="cursor-pointer md:mt-5 mt-2 mr-3 hover:text-fuchsia-700"><a href='/cashpoints'>Cashpoints</a></li>
                <li className="cursor-pointer md:mt-5 mt-2 mr-3 hover:text-fuchsia-700"><a href='/dao'>DAO</a></li>
                <div className='w-fit '>
                {/* Token balance displayed here */}
                <li className="cursor-pointer md:mt-0 mt-2 mr-3 text-yellow-400" style={{ fontFamily: 'Digital-7, monospace' }}>
                  {tokenBalance ? `Balance: $${tokenBalance}` : "Loading..."}
                </li>
  
                {/* Connect button */}
                <button
                  onClick={() =>  {if (address) {
                    navigator.clipboard.writeText(address)
                    return;
                  } 
                    console.log("No wallet connected");
                  }}
                  className="text-white w-[180px] truncate md:mt-0 bg-[#872A7F] py-2 px-5 rounded drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring"
                >
                  {<AccountBalanceWalletIcon className='mb-1 mr-2 ml-0'/>} 
                  {address? address : "Connect"}
                </button>

                </div>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
     
};

export default NavBar;
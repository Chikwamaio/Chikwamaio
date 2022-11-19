import NavBar from './NavBar'
import Footer from './Footer'
import { useState } from 'react';
import { useEffect } from 'react';
import cashPoints from '../../../contracts/artifacts/contracts/Cashpoints.sol/CashPoints.json';
import { ethers } from 'ethers';


const Dao = () => {




   
    
       useEffect(() => {
    
      }, [])

    return(
        <><div className='min-h-screen flex flex-col text-slate-500'>
        <NavBar/>
        <main className=' text-black container mx-auto px-6 pt-16 flex-1 text-left'>
            
        </main>
        <Footer/>
        </div>
        </>);
}

export default Dao;
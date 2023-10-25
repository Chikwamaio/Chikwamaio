import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

    const { ethereum } = window;
    const navigate = useNavigate();

    useEffect(() => {
        ethereum ? navigate('/Home') : null;

    }, []);

    return (
        <div>
            <h2 className='md:text-3xl text-3xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
            <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
            <p className='py-4 text-slate-700'>Why use Chikwama?</p>
            <ul className='list-disc pl-8'>
                <li className='text-slate-700'>Find Cashpoints: Locate nearby cashpoints where you can convert xDai to local currency effortlessly.</li>
                <li className='text-slate-700'>Nominal Fee: Chikwama charges a nominal fee of 1% for providing the cashpoint conversion service.</li>
            </ul>
            <p className='py-4 text-slate-700'>To get started, install <a className='text-fuchsia-700' href='https://metamask.io/'>MetaMask</a> (or another Ethereum-compatible wallet) and experience the future of decentralized finance with Chikwama.</p>
            <p className='py-4 text-slate-700'>If you have any questions or need help getting started with Chikwama or MetaMask, please don't hesitate to reach out to us.</p>
        </div>
    );
}

export default LandingPage;

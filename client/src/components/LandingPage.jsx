import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const { ethereum } = window;
    const navigate = useNavigate();

    useEffect(() => {
        ethereum ? navigate('/Home') : null;
    }, []);

    return (
        <div className="md:px-20 lg:px-32 xl:px-40">
            <h2 className='md:text-3xl text-3xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
            <h1 className='text-3xl md:text-3xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>

            {/* Embedded YouTube video */}
            <div className="py-4">
                <p className='py-4 text-slate-700'>How it Works:</p>
                <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/P__KTNLBWLc?si=5bEb7hAI99uBfj1X"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>

            <p className='py-4 text-slate-700'>Why use Chikwama?</p>
            <ul className='list-disc pl-8'>
                <li className='text-slate-700'>Find Cashpoints: Locate nearby cashpoints where you can convert xDai to local currency effortlessly.</li>
                <li className='text-slate-700'>Nominal Fee: Chikwama charges a nominal fee of 1% for providing the cashpoint conversion service.</li>
            </ul>

            <p className='py-4 text-slate-700'>
                If you have any questions or need help getting started with Chikwama or MetaMask, please don't hesitate to <a href="mailto:info@chikwama.net" className='text-fuchsia-700'>reach out to us</a>.
            </p>
        </div>
    );
}

export default LandingPage;

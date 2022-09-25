import { useState } from 'react'
import chikwamaLogo from './assets/Icon100.png'
import reactLogo from './assets/react.svg'
import './App.css'
import Web3 from 'web3';


function App() {
  const [count, setCount] = useState(0)

  function componentWillMount(){ this.loadBlockChainData();}

  const downloadApp = () => {

    window.location.href = 'https://testflight.apple.com/join/MTNmiNCj';

  }

  const loadBlockChainData = async () =>{
    const web3 = new Web3("https://rpc.gnosischain.com");
    const network = await web3.eth.getBalance(web3.eth.getAccounts[0]);
    console.log('Current network:', network);

  }

  return (
    <div className='min-h-screen flex flex-col text-slate-500'>
      <header className="flex flex-row items-center justify-between drop-shadow-md py-2 px-5 bg-white">
      <div className="flex flex-row justify-center items-center cursor-pointer uppercase">
        <img
          className="w-6 h-6 object-contain cursor-pointer"
          src={chikwamaLogo}
          alt="Etherium Logo"
        />
        <span>Chikwama</span>
      </div>
      <nav className="flex flex-row justify-center items-center list-none">
        <li className="cursor-pointer mr-3 hover:text-fuchsia-700">Pricing</li>
        <li className="cursor-pointer mr-3 hover:text-fuchsia-700">Docs</li>
        <li className="cursor-pointer mr-3">
          <button
            onClick={downloadApp}
            className="text-white bg-fuchsia-700 py-2 px-5 rounded-xl drop-shadow-xl border border-transparent hover:bg-transparent hover:text-fuchsia-700 hover:border hover:border-fuchsia-700 focus:outline-none focus:ring"
          >
            Try it!
          </button>
        </li>
      </nav>
    </header>
      <main className='container mx-auto px-6 pt-16 flex-1 text-left'>
      <h2 className='text-2xl md:text-4xl text-slate-700 lg:text-6xl uppercase'> Welcome to</h2>
      <h1 className='text-3xl md:text-6xl text-slate-700 lg:text-8xl font-bold uppercase mb-8'>Chikwama</h1>
      <div className='text-lg  float-left text-yellow-400 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-4 rounded-full'>
      US$ 34.00 Total value locked
      </div>
      <div className='text-lg float-left text-fuchsia-700 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-8 rounded-full'>
      10 Cash points
      </div>
      <div className='text-lg float-left text-yellow-400 md:text-2xl lg:text-3xl py-2 px-4 md:py-4 md:px-10 lg:py-6 lg:px-12 bg-slate-800 bg-opacity-20 w-fit mx-auto mb-8 rounded-full'>
      2 % Transaction fee
      </div>
      </main>
      <footer className='container mx-auto p-6 flex flex-col md:flex-row items-center justify-between'>
        <p>Built with ❤️ by the Chikwama community</p>

        <div className='flex -mx-6'>
          <a href='#' className='mx-3 hover:opacity-80 duration-150'>About us</a>|
          <a href='https://www.privacypolicies.com/live/9a2ebd42-f5f8-4a54-97d4-7234c87d8441' className='mx-3 hover:opacity-80 duration-150'>Privacy</a>|
          <a href='#' className='mx-3 hover:opacity-80 duration-150'>Contact</a>
        </div>
      </footer>
    </div>
  )
}

export default App

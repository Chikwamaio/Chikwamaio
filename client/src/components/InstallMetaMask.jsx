export const renderMetaMaskPrompt = () => (
    <div className="flex flex-col items-center justify-center h-screen text-center text-slate-500">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600">Oops! No MetaMask detected!</h2>
        <p className="mt-4 text-lg">
            This is a blockchain app. To experience the *Internet of Value*, you'll need MetaMask installed.  
            <br />
            Don't worry, it's not as scary as it sounds!
        </p>
        <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 text-white bg-[#872A7F] py-3 px-8 rounded-full shadow-lg border border-transparent hover:bg-transparent hover:text-[#872A7F] hover:border-[#872A7F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#872A7F]"
        >
            Install MetaMask
        </a>
    </div>
);
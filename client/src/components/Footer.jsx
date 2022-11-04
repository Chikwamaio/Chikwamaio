const Footer = () => {
    return(
        <>
        <footer className='container mx-auto p-6 flex flex-col md:flex-row min-w-fit absolute bottom-0 '>
        <p className='flex-auto'>Built with ❤️ by the Chikwama community</p>

        <div >
          <a href='#' className='mx-3 hover:opacity-80 duration-150'>About us</a>|
          <a href='https://www.privacypolicies.com/live/9a2ebd42-f5f8-4a54-97d4-7234c87d8441' className='mx-3 hover:opacity-80 duration-150'>Privacy</a>|
          <a href='#' className='mx-3 hover:opacity-80 duration-150'>Contact</a>
        </div>
      </footer>
        </>
    )
};

export default Footer;
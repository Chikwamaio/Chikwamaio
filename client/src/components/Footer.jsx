const Footer = () => {
    return(
        <>
        <footer className='mx-auto p-6  flex flex-col md:flex-row md:max-w-full w-full absolute bottom-0 pr-2'>
        <p className='flex-auto'>Built with ❤️ by the Chikwama community</p>

        <div className='self-end' >
          <a href='#' className='mx-3 hover:opacity-80 duration-150'>About us</a>|
          <a href='https://www.privacypolicies.com/live/9a2ebd42-f5f8-4a54-97d4-7234c87d8441' className='mx-3 hover:opacity-80 duration-150'>Privacy</a>|
          <a href='#' className='mx-3 hover:opacity-80 duration-150'>Contact</a>|
          <a href='https://github.com/Chikwama-io/ChikwamaWebsite' className='mx-3 hover:opacity-80 duration-150'> Github</a>
        </div>
      </footer>
        </>
    )
};

export default Footer;
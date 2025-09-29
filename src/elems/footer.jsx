
function Footer() {
    return (
        <>
            <footer className="flex flex-col lg:flex-row justify-center items-center lg:justify-evenly lg:mb-15">
                <div className="lg:order-2">
                    <a href="/home" className="transition-transform hover:scale-105">
                        <img className="mt-5 w-60 h-auto" src="/icon-nobg.png" alt="ashford partners icon" />
                    </a>
                    <div className="flex justify-between items-center mt-5">
                        <a className="underline text-[10px] lg:text-xl text-gray-400" href="#about-us">About us</a>
                        <a className="underline text-[10px] lg:text-xl text-gray-400" href="#contact-us">Contact us</a>
                    </div>
                </div>  
                <div className="mt-5 lg:order-1 lg:ml-[-200px]">
                    <p className="text-[10px] lg:text-xl">71-75 Shelton Street, WC2H 9JQ, London, United Kingdom</p>
                </div>  
                <div className="mt-5 mb-5 lg:order-3">
                    <p className="text-[10px] lg:text-xl">info@maxiai.co.uk</p>
                </div>
            </footer>
            
        </>
    )
}
export default Footer  
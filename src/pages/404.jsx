import Header from '../elems/header.jsx'
import Footer from '../elems/footer.jsx'

function NotFound() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path = {"/icon-nobg.png"}
          hero_img={"/1.jpg"}
          hero_head={<>404 Not found</>}
          hero_para={<>Sadly we couldn't find the page you're looking for...</>}
       />
        <Footer />
      </div>
    </>
    
  )
}

export default NotFound

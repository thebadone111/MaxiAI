import Header from '../../elems/header.jsx'
import Footer from '../../elems/footer.jsx'
import ContactForm from '../../elems/contact_form.jsx'


function ContactUsEn() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path={"/icon-nobg.png"}
          hero_img={"/6.jpg"}
          hero_head={<>Your Digital Future Starts Here</>}
          hero_para={<>Looking to create a secure website, set up reliable IT infrastructure, or discuss advanced cybersecurity solutions? Fill out the form below and a Maxi AI Development representative will get back to you promptly. Together, we’ll build technology you can trust.</>}
        />
        <ContactForm />
        <Footer />
      </div>
    </>
  )
}

export default ContactUsEn

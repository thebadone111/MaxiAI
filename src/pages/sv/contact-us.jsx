import Header from '../../elems/header.jsx'
import Footer from '../../elems/footer.jsx'
import ContactForm from '../../elems/contact_form.jsx'


function ContactUsSv() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path={"/icon-nobg.png"}
          hero_img={"/6.jpg"}
          hero_head={<>Din digitala framtid börjar här</>}
          hero_para={<>Vill du skapa en säker webbplats, sätta upp en pålitlig IT-infrastruktur eller diskutera avancerade cybersäkerhetslösningar? Fyll i formuläret nedan så återkommer en representant från Maxi AI Development till dig snarast. Tillsammans bygger vi teknik du kan lita på.</>}
        />
        <ContactForm />
        <Footer />
      </div>
    </>
  )
}

export default ContactUsSv

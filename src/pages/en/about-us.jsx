import Header from '../../elems/header.jsx'
import TextSection from '../../elems/text_section.jsx'
import Partner from '../../elems/partner.jsx'
import Footer from '../../elems/footer.jsx'

function AboutUsEn() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path={"/icon-nobg.png"}
          hero_img={"/5.jpg"}
          hero_head={<><span className='glow-text-strong text-white'>Learn more about us</span></>}
          hero_para={<>We create secure, scalable, and reliable digital solutions—helping businesses succeed in today’s connected world.</>}
        />
        <TextSection 
          header={<h2 className='text-5xl lg:text-7xl'>About us</h2>}
          text_arr={[
            [
              <p className="text-lg lg:text-2xl leading-relaxed">
                Maxi AI Development Ltd is a technology consultancy dedicated to building secure and future-ready IT systems. Rooted in expertise and reliability, we combine technical innovation with a customer-first mindset to ensure every solution stands on a solid digital foundation.
              </p>
            ],
            [
              <p className="text-lg lg:text-2xl leading-relaxed">
                From website creation and hosting to cybersecurity frameworks and enterprise IT infrastructure, we simplify complexity and keep systems running smoothly. Our team manages every detail—from domains and email to cloud platforms—so you can focus on growing your business with confidence.
              </p>
            ],
            [
              <p className="text-lg lg:text-2xl leading-relaxed">
                Whether you are launching a startup, scaling an enterprise, or securing sensitive data, Maxi AI Development provides the experience, resources, and dedication to bring your digital vision to life. Together, we build technology that lasts—designed for today and ready for tomorrow.
              </p>
            ]
          ]}
          img_name="/6.jpg"
          img_alt="Service illustration"
          reverse={true}
        />
        <Partner 
          header={<>Contact us today.</>}
        />
        <Footer />
      </div>
    </>
  )
}

export default AboutUsEn

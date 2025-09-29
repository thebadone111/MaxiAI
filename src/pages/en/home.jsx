import Header from '../../elems/header.jsx'
import Welcome from '../../elems/welcome.jsx'
import Feedback from '../../elems/client_feedback.jsx'
import Divider from '../../elems/divider.jsx'
import TextSection from '../../elems/text_section.jsx' 
import SimpleText from '../../elems/simple_text.jsx'
import Partner from '../../elems/partner.jsx'
import Footer from '../../elems/footer.jsx'

function HomeEn() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path = {"/icon-nobg.png"}
          hero_img={"/3.jpg"}
          hero_head={<>Comprehensive <span className='glow-text-strong'>IT</span> & <span className='glow-text-strong'>Cybersecurity</span> Solutions for <span className='glow-text-strong'>Modern Businesses</span></>}
          hero_para={<>Whether you need a <span className='text-accent glow-text-strong'>secure website</span>, <span className='text-accent glow-text-strong'>enterprise email setup</span>, or <span className='text-accent glow-text-strong'>advanced anonymity and cybersecurity systems</span>, Maxi AI delivers robust IT solutions <span className='text-accent glow-text-strong'>tailored to your business.</span></>}
        />
        <Welcome 
          header = {<>Welcome to <span>Maxi Ai Devleopment</span></>}
          para = {<>Maxi AI Development Ltd specialises in secure website creation, advanced cybersecurity systems, and end-to-end IT infrastructure. With a customer-first approach and a commitment to reliability, we deliver tailored digital solutions that keep your business connected and protected — from the first domain to full enterprise integration.</>}
        />
        <Divider />
        <Feedback 
          header={<>Maxi AI Development <span className="text-[#1E2EEB]">Expertise</span></>}
          para={<>With years of technical experience, Maxi AI Development Ltd delivers secure, scalable, and tailored IT solutions for businesses of all sizes. From website creation and hosting to cybersecurity and enterprise infrastructure, we provide the reliability and protection you need to operate with confidence. We offer:</>}
          text_arr={[
            [            
              <h2 className="mb-5 md:text-3xl font-medium">Web Development & Hosting</h2>,
              <p className='font-light md:text-lg'>Designing, building, and hosting professional websites that combine performance, security, and ease of management — ensuring your business is always online and accessible.</p>
            ],
            [  
              <h2 className="mb-5 md:text-3xl font-medium">Cybersecurity & Anonymity Systems</h2>,
              <p className='font-light md:text-lg'>Protecting your digital assets with advanced cybersecurity frameworks, anonymity tools, and proactive monitoring — keeping your operations secure in an evolving threat landscape.</p>
            ],
            [  
              <h2 className="mb-5 md:text-3xl font-medium">IT Infrastructure & Cloud Services</h2>,
              <p className='font-light md:text-lg'>Implementing and managing enterprise IT systems, from email and domain setup to Microsoft 365 and Google Workspace — scalable solutions that grow with your business.</p>
            ]
          ]}
          button={true}
        />
        <SimpleText 
          text={<>Secure systems. Smarter technology. Lasting impact.</>}
        />
        <TextSection
          header={<h2 className='text-5xl lg:text-7xl text-[#1E2EEB]'>Why Choose Maxi AI Development?</h2>}
          text_arr={[
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Tailored IT Solutions
              </h3>, 
              <p className="text-lg lg:text-2xl leading-relaxed">
                Every business is unique. We adapt our digital services to your specific needs — from simple websites to complex enterprise infrastructure.
              </p>
            ],
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Proven Expertise
              </h3>,
              <p className="text-lg lg:text-2xl leading-relaxed">
                Years of experience in web development, cybersecurity, and IT management ensure secure, reliable, and professional solutions.
              </p>
            ],
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Scalable Capacity
              </h3>,
              <p className="text-lg lg:text-2xl leading-relaxed">
                From small businesses to large enterprises, we deliver solutions that grow with your operations — scalable, efficient, and future-ready.
              </p>
            ],
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Security You Can Trust
              </h3>,
              <p className="text-lg lg:text-2xl leading-relaxed">
                We build with security in mind — protecting your websites, data, and IT systems with robust frameworks and best practices.
              </p>
            ]
          ]}
          img_name="/4.jpg"
          img_alt="Service illustration"
          reverse={false}
        />
        <Divider />
        <Feedback 
          header={<>How it Works</>}
          para={<>Getting started with Maxi AI Development is simple:</>}
          text_arr={[
            [            
              <h2 className="mb-5 lg:text-4xl">Consultation</h2>,
              <p>We begin with a detailed discussion of your business needs, digital goals, and security requirements to understand your exact challenges.</p>
            ],
            [  
              <h2 className="mb-5 lg:text-4xl">Planning & Strategy</h2>,
              <p>Together we define the scope, solutions, and roadmap — giving you full clarity before implementation begins.</p>
            ], 
            [
              <h2 className="mb-5 lg:text-4xl">Implementation & Support</h2>,
              <p>From website creation to IT infrastructure and cybersecurity, we handle everything end-to-end — ensuring your systems are secure, reliable, and future-ready.</p>
            ]
          ]}
          button={false}
        />
        <Partner 
          header={<>Secure Foundations Start Here</>}
          para={<>Ready to upgrade your business IT? Trust Maxi AI Development for the expertise, security, and infrastructure your company deserves.</>}
        />
        <Footer />
      </div>
    </>
  )
}

export default HomeEn

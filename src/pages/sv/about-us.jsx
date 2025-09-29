import Header from '../../elems/header.jsx'
import TextSection from '../../elems/text_section.jsx'
import Partner from '../../elems/partner.jsx'
import Footer from '../../elems/footer.jsx'

function AboutUsSv() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path = {"/icon-nobg.png"}
            hero_img={"/4.jpg"}
            hero_head={<>Lär känna oss bättre</>}
            hero_para={<>Vi bygger med precision, kvalitet och förtroende — och hjälper projekt att lyckas från grund till färdigställande.</>}
          />
        <TextSection 
          header={<h2 className='text-5xl lg:text-7xl'>Om oss</h2>}
          text_arr={[
            [
              <p className="text-lg lg:text-2xl leading-relaxed">
                Yalba Construction AB är ett svenskt byggföretag som fokuserar på att leverera pålitliga bygglösningar. Med rötter i hantverk och integritet kombinerar vi stark teknisk expertis med ett kundfokuserat arbetssätt för att säkerställa att varje projekt vilar på en stabil grund.
              </p>
            ],
            [
              <p className="text-lg lg:text-2xl leading-relaxed">
                Från högkvalitativa byggtjänster till pålitliga material och professionell projektledning förenklar vi komplexitet och ser till att projekten flyter på smidigt. Vårt team hanterar varje detalj, så att du kan fokusera på helheten och veta att ditt bygge är i trygga händer.
              </p>
            ],
            [
              <p className="text-lg lg:text-2xl leading-relaxed">
                Oavsett om du utvecklar bostäder, kommersiella lokaler eller storskaliga projekt, erbjuder Yalba Construction erfarenhet, resurser och engagemang för att förverkliga din vision. Tillsammans bygger vi strukturer som håller — skapade för idag och redo för framtiden.
              </p>
            ]
          ]}
          img_name="/5.jpg"
          img_alt="Service illustration"
          reverse={true}
        />
        <Partner 
          header={<>Kontakta oss idag.</>}
          
        />
        <Footer />
      </div>
    </>
  )
}

export default AboutUsSv

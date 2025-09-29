import Header from '../../elems/header.jsx'
import Welcome from '../../elems/welcome.jsx'
import Feedback from '../../elems/client_feedback.jsx'
import Divider from '../../elems/divider.jsx'
import TextSection from '../../elems/text_section.jsx' 
import SimpleText from '../../elems/simple_text.jsx'
import Partner from '../../elems/partner.jsx'
import Footer from '../../elems/footer.jsx'

function HomeSv() {
  return (
    <>
      <div className='max-w-screen'>
        <Header 
          logo_path = {"/icon-nobg.png"}
          hero_img={"/3.jpg"}
          hero_head={<>Omfattande <span className='glow-text-strong'>IT</span> & <span className='glow-text-strong'>Cybersäkerhets</span>lösningar för <span className='glow-text-strong'>moderna företag</span></>}
          hero_para={<>Oavsett om du behöver en <span className='text-accent glow-text-strong'>säker webbplats</span>, <span className='text-accent glow-text-strong'>företags-e-postlösning</span> eller <span className='text-accent glow-text-strong'>avancerade anonymitets- och cybersäkerhetssystem</span>, levererar Maxi AI robusta IT-lösningar <span className='text-accent glow-text-strong'>anpassade efter ditt företag.</span></>}
        />
        <Welcome 
          header = {<>Välkommen till <span>Maxi AI Development</span></>}
          para = {<>Maxi AI Development Ltd är specialiserat på säker webbplatsutveckling, avancerade cybersäkerhetssystem och heltäckande IT-infrastruktur. Med ett kundfokuserat arbetssätt och ett åtagande om pålitlighet levererar vi skräddarsydda digitala lösningar som håller ditt företag uppkopplat och skyddat — från den första domänen till full företagsintegration.</>}
        />
        <Divider />
        <Feedback 
          header={<>Maxi AI Development <span className="text-[#1E2EEB]">Expertis</span></>}
          para={<>Med många års teknisk erfarenhet levererar Maxi AI Development Ltd säkra, skalbara och skräddarsydda IT-lösningar för företag i alla storlekar. Från webbplatsutveckling och hosting till cybersäkerhet och företagsinfrastruktur, ger vi den pålitlighet och det skydd du behöver för att driva verksamheten med förtroende. Vi erbjuder:</>}
          text_arr={[
            [            
              <h2 className="mb-5 md:text-3xl font-medium">Webbutveckling & Hosting</h2>,
              <p className='font-light md:text-lg'>Vi designar, bygger och hostar professionella webbplatser som kombinerar prestanda, säkerhet och enkel hantering — så att ditt företag alltid är online och tillgängligt.</p>
            ],
            [  
              <h2 className="mb-5 md:text-3xl font-medium">Cybersäkerhet & Anonymitetssystem</h2>,
              <p className='font-light md:text-lg'>Vi skyddar dina digitala tillgångar med avancerade cybersäkerhetsramverk, anonymitetsverktyg och proaktiv övervakning — så att din verksamhet förblir säker i en föränderlig hotmiljö.</p>
            ],
            [  
              <h2 className="mb-5 md:text-3xl font-medium">IT-infrastruktur & Molntjänster</h2>,
              <p className='font-light md:text-lg'>Vi implementerar och hanterar företags-IT-system, från e-post och domäner till Microsoft 365 och Google Workspace — skalbara lösningar som växer med ditt företag.</p>
            ]
          ]}
          button={true}
        />
        <SimpleText 
          text={<>Säkra system. Smartare teknologi. Bestående effekt.</>}
        />
        <TextSection
          header={<h2 className='text-5xl lg:text-7xl text-[#1E2EEB]'>Varför välja Maxi AI Development?</h2>}
          text_arr={[
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Skräddarsydda IT-lösningar
              </h3>, 
              <p className="text-lg lg:text-2xl leading-relaxed">
                Varje företag är unikt. Vi anpassar våra digitala tjänster efter dina behov — från enkla webbplatser till komplex företagsinfrastruktur.
              </p>
            ],
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Beprövad expertis
              </h3>,
              <p className="text-lg lg:text-2xl leading-relaxed">
                Många års erfarenhet inom webbutveckling, cybersäkerhet och IT-hantering garanterar säkra, pålitliga och professionella lösningar.
              </p>
            ],
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Skalbar kapacitet
              </h3>,
              <p className="text-lg lg:text-2xl leading-relaxed">
                Från småföretag till stora organisationer levererar vi lösningar som växer med din verksamhet — skalbara, effektiva och framtidssäkra.
              </p>
            ],
            [
              <h3 className="mb-5 text-3xl lg:text-4xl font-semibold">
                Säkerhet du kan lita på
              </h3>,
              <p className="text-lg lg:text-2xl leading-relaxed">
                Vi bygger med säkerhet i fokus — vi skyddar dina webbplatser, data och IT-system med robusta ramverk och beprövade metoder.
              </p>
            ]
          ]}
          img_name="/4.jpg"
          img_alt="Service illustration"
          reverse={false}
        />
        <Divider />
        <Feedback 
          header={<>Så fungerar det</>}
          para={<>Att komma igång med Maxi AI Development är enkelt:</>}
          text_arr={[
            [            
              <h2 className="mb-5 lg:text-4xl">Konsultation</h2>,
              <p>Vi börjar med en detaljerad diskussion om dina affärsbehov, digitala mål och säkerhetskrav för att förstå dina utmaningar.</p>
            ],
            [  
              <h2 className="mb-5 lg:text-4xl">Planering & Strategi</h2>,
              <p>Tillsammans definierar vi omfattning, lösningar och en tydlig plan — vilket ger dig full transparens innan implementeringen startar.</p>
            ], 
            [
              <h2 className="mb-5 lg:text-4xl">Implementering & Support</h2>,
              <p>Från webbplatsutveckling till IT-infrastruktur och cybersäkerhet hanterar vi allt från början till slut — och säkerställer att dina system är säkra, pålitliga och redo för framtiden.</p>
            ]
          ]}
          button={false}
        />
        <Partner 
          header={<>Säkra grunder börjar här</>}
          para={<>Redo att uppgradera ditt företags IT? Lita på Maxi AI Development för expertis, säkerhet och infrastruktur som ditt företag förtjänar.</>}
        />
        <Footer />
      </div>
    </>
  )
}

export default HomeSv

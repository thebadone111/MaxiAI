import PageMeta from '../../elems/pagemeta.jsx';
import {
  LegalHero,
  LegalBody,
  LegalFootNote,
  P,
  H,
  Bullets,
  Note,
  Table,
  Xlink,
  Alink,
} from '../../elems/legal.jsx';
import { legalEntity, legalUpdated, ico } from '../../data/legal.js';

const E = legalEntity;

/**
 * Privacy notice.
 *
 * Written as one continuous document rather than a set of collapsed panels:
 * a notice that has to be clicked open eleven times is not, in any useful
 * sense, transparent. Clause 05 carries the most weight — it is the
 * Article 14 disclosure for people whose details we found in public sources
 * rather than received from them, which is the part of our processing a
 * reader is least likely to expect.
 */

const sections = [
  /* ── 01 ─────────────────────────────────────────────── */
  {
    id: 'who-we-are',
    title: 'Who we are, and who is responsible for your data',
    body: (
      <>
        <P>
          This notice explains what {E.name} does with personal data — what we collect, why we are
          allowed to hold it, how long we keep it, who else sees it, and what you can require us to
          do about it. It is written to be read, not to be survived. Where we have had to use a
          legal term, we have said what it means.
        </P>
        <P>
          For everything described in this notice, {E.name} is the <strong>data controller</strong>.
          That means we are the organisation that decides why your personal data is processed and
          how, and we are the organisation legally answerable for it.
        </P>
        <Table
          head={['', '']}
          rows={[
            ['Registered name', E.name],
            ['Registered in', `${E.jurisdiction}, company number ${E.companyNo}`],
            ['Incorporated', E.incorporated],
            ['Registered office', E.registeredOffice.join(', ')],
            [
              'ICO registration',
              <>
                {E.icoRegNo} — registered with the {ico.name} as a data controller
              </>,
            ],
            [
              'Data protection contact',
              <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink>,
            ],
          ]}
        />
        <P>
          We are a two-person company. We are not required to appoint a statutory Data Protection
          Officer and we have not appointed one. Data protection questions are handled by the
          founders directly, at the address above, and you will get an answer from a person who
          knows the systems rather than from a queue.
        </P>
      </>
    ),
  },

  /* ── 02 ─────────────────────────────────────────────── */
  {
    id: 'scope',
    title: 'What this notice covers — and what it does not',
    body: (
      <>
        <P>
          This notice applies to the website at <strong>{E.site}</strong>, to enquiries and
          correspondence you send us, to our relationships with clients and suppliers, and to the
          business-to-business prospecting described in clause 05.
        </P>
        <H>It does not cover our invite-only dashboard</H>
        <P>
          We operate a separate, invite-only social media dashboard at{' '}
          <strong>socials.maxiai.co.uk</strong>. That is a different product with a different data
          footprint, and it is governed by its own privacy notice and its own terms, presented to
          you when you are invited to it. Nothing in this notice describes what happens inside that
          application.
        </P>
        <H>It does not cover data we handle on a client’s behalf</H>
        <P>
          A large part of our work is building and maintaining systems that belong to our clients —
          websites, hosting, Microsoft 365 estates, bespoke software. When we work inside a client’s
          systems, any personal data in them belongs to that client. They are the controller, we are
          their <strong>processor</strong>, and we act only on their documented instructions under a
          written agreement that meets Article 28 of the UK GDPR.
        </P>
        <Note>
          If you are a customer, employee or contact of one of our clients and you want to exercise
          your rights over data held in their systems, your request needs to go to them, not to us.
          If you send it to us anyway, we will pass it on and tell you that we have.
        </Note>
      </>
    ),
  },

  /* ── 03 ─────────────────────────────────────────────── */
  {
    id: 'what-we-collect',
    title: 'The personal data we collect',
    body: (
      <>
        <P>
          We collect very little, and almost all of it is business contact information that you or
          your employer has already put into commercial circulation. Here is the whole of it.
        </P>
        <H>If you visit the website</H>
        <P>
          The site sets no cookies of its own and asks for no consent, because it has nothing to ask
          consent for. Clause 07 sets out the detail. What is unavoidably processed is:
        </P>
        <Bullets
          items={[
            <>
              <strong>Aggregate visit statistics</strong> — collected by Cloudflare Web Analytics,
              which is cookieless and does not fingerprint or track individual visitors across
              sites. We see page views, referrers, country and broad device type. We cannot see who
              you are.
            </>,
            <>
              <strong>Technical connection data</strong> — your IP address, browser user-agent and
              the time of your request are processed transiently by our hosting provider in order to
              serve the page to you at all, and to absorb attacks and abuse.
            </>,
            <>
              <strong>Your IP address, by Google</strong> — our pages load typefaces from the Google
              Fonts service, which means your browser makes a request to Google and Google receives
              your IP address as a consequence. We do not receive anything back, and we do not use
              this for any purpose of our own. We are naming it because it is a real disclosure of
              your data to a third party, and most sites that do it do not say so.
            </>,
          ]}
        />
        <H>If you use the enquiry form or write to us</H>
        <Bullets
          items={[
            <>
              <strong>What the form asks for</strong> — first name, last name, email address, a
              subject line, and the message you write. Nothing else is collected, and there is no
              hidden field beyond a spam trap and a timestamp.
            </>,
            <>
              <strong>Whatever you choose to put in the message</strong> — which is the part we have
              no control over. Please do not send us confidential material, special category data
              (health, ethnicity, religion, political opinions, trade union membership, sex life or
              orientation, genetic or biometric data) or anyone else’s personal data in a first
              approach. We do not need it to answer you.
            </>,
            <>
              <strong>Correspondence by email or phone</strong> — the contents, and the fact and
              time of it.
            </>,
          ]}
        />
        <H>If you become, or nearly become, a client</H>
        <Bullets
          items={[
            'Names, job titles, business email addresses and business phone numbers for the people we deal with.',
            'Billing details: company name, billing address, VAT number where applicable, and the bank details you pay us from. We do not store card numbers, because we do not take card payments.',
            'The record of the engagement: proposals, scopes, contracts, invoices, tickets, access logs and correspondence.',
          ]}
        />
        <H>If we approach you first</H>
        <P>
          Business contact details taken from public sources, which is a distinct enough activity
          that it has clause 05 to itself.
        </P>
        <H>If you apply to work with us</H>
        <P>
          The CV, covering note and contact details you send, and our notes from any conversation.
          We keep unsuccessful applications for six months in case something more suitable comes up,
          and delete them at that point unless you have asked us to keep them longer.
        </P>
        <Note>
          We do not knowingly collect data about anyone under 18, we do not carry out profiling or
          automated decision-making that produces legal or similarly significant effects, and we do
          not sell, rent or trade personal data. Not to anyone, at any price.
        </Note>
      </>
    ),
  },

  /* ── 04 ─────────────────────────────────────────────── */
  {
    id: 'lawful-basis',
    title: 'Why we are allowed to hold it — our lawful bases',
    body: (
      <>
        <P>
          UK GDPR requires a lawful basis for every purpose we process personal data for. Not one
          basis for the company — one for each thing we do. This is the complete list.
        </P>
        <Table
          head={['What we do', 'Why', 'Lawful basis']}
          rows={[
            [
              'Serve the website and keep it up',
              'You cannot be shown a page without your request being processed',
              'Legitimate interests — running a functioning, secure website',
            ],
            [
              'Aggregate, cookieless analytics',
              'To know which pages are read and which are not',
              'Legitimate interests — understanding whether our own site works',
            ],
            [
              'Answer your enquiry',
              'You asked us a question and we would like to answer it',
              'Legitimate interests, and steps prior to entering a contract at your request',
            ],
            [
              'Scope, quote and deliver work',
              'To do the job you have engaged us for',
              'Performance of a contract',
            ],
            [
              'Invoice, chase payment, keep accounts',
              'We are required to keep accurate financial records',
              'Legal obligation, and performance of a contract',
            ],
            [
              'B2B prospecting from public sources',
              'To offer relevant services to businesses that plausibly need them',
              'Legitimate interests — assessed and documented (clause 05)',
            ],
            [
              'Marketing to sole traders and unincorporated partnerships',
              'They have the protections of individuals under PECR',
              'Consent',
            ],
            [
              'Keep a suppression list of people who told us to stop',
              'The only reliable way to guarantee we do not contact you again',
              'Legal obligation, and legitimate interests',
            ],
            [
              'Security, backups, fraud and abuse prevention',
              'To keep your data and ours from being lost or stolen',
              'Legitimate interests, and legal obligation',
            ],
            [
              'Establish, exercise or defend legal claims',
              'If something goes wrong and has to be resolved formally',
              'Legitimate interests, and legal obligation',
            ],
          ]}
        />
        <P>
          Where we rely on <strong>legitimate interests</strong>, we have weighed our interest
          against your rights and freedoms and concluded that ours does not override yours. You are
          entitled to see that reasoning: ask at{' '}
          <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink> and we will send you the
          relevant assessment. Where we rely on <strong>consent</strong>, you can withdraw it at any
          moment, and withdrawing it is as easy as giving it was; withdrawal does not make our
          earlier processing unlawful, it just stops it going forward.
        </P>
      </>
    ),
  },

  /* ── 05 ─────────────────────────────────────────────── */
  {
    id: 'prospecting',
    title: 'B2B prospecting: how we use publicly available information',
    body: (
      <>
        <P>
          We are a small studio, and some of our work begins with us approaching a business rather
          than the other way round. To do that we use information that is already published — on
          Companies House, on company websites, in trade directories, in the press, and on public
          professional profiles. This clause explains exactly how we do it, and the rules we hold
          ourselves to. If you received a message from us and came here to find out how we got your
          details, this is the answer.
        </P>
        <Note>
          Publicly available does not mean unprotected. A name and a work email address published on
          a company website are still that person’s personal data, and the UK GDPR still applies to
          them in full. We treat public data with exactly the same care as data you hand us
          directly — the ICO’s position, and ours.
        </Note>

        <H>Where we look</H>
        <Bullets
          items={[
            'The Companies House public register — company names, registered offices, and the names and roles of directors.',
            'The ICO’s own public register of data controllers.',
            'Company websites: the “team”, “about” and “contact” pages that a business publishes precisely so that people can get in touch.',
            'Public professional networking profiles, principally LinkedIn, viewed as any other user would view them.',
            'Trade directories, industry body membership lists, conference and event listings, and published press coverage.',
          ]}
        />

        <H>What we take, and what we deliberately do not</H>
        <P>
          We take the minimum needed to make a relevant approach to a business: name, job title,
          employer, business email address, business phone number, business postal address, and the
          publicly stated facts about what the company does. That is the whole record.
        </P>
        <Bullets
          items={[
            'We do not collect personal email addresses, personal mobile numbers or home addresses.',
            'We do not collect or infer special category data — health, ethnicity, religion, political opinion, trade union membership, sexual orientation, genetic or biometric data.',
            'We do not buy, rent or otherwise acquire third-party marketing lists, and we do not use data brokers.',
            'We do not build behavioural profiles, score you, or make automated decisions about you.',
            'We do not use automated scraping tools against platforms whose terms forbid it.',
          ]}
        />

        <H>Our lawful basis, and the assessment behind it</H>
        <P>
          We rely on <strong>legitimate interests</strong> under Article 6(1)(f) of the UK GDPR. The
          ICO expects that to be documented in a Legitimate Interests Assessment before the
          processing begins, and ours runs as follows.
        </P>
        <Bullets
          items={[
            <>
              <strong>Purpose test.</strong> We have a genuine commercial interest in telling
              businesses that plausibly need software, security or IT infrastructure work that we
              exist and what we charge. The recipient’s employer has a corresponding interest in
              hearing from qualified suppliers.
            </>,
            <>
              <strong>Necessity test.</strong> There is no less intrusive way to make a first
              approach to a named person at a business than to use the business contact details that
              business has published for the purpose. We use no more data than the approach needs.
            </>,
            <>
              <strong>Balancing test.</strong> The data is limited to the professional sphere, it
              was published deliberately and in a business context, the approach is relevant to the
              recipient’s actual role, the volume is low, every message identifies us plainly, and
              every message carries a working way to stop them. The impact on the individual is
              slight and entirely within their reasonable expectations. We consider that our
              interest is not overridden by their rights and freedoms.
            </>,
          ]}
        />
        <P>
          That assessment is reviewed when what we do changes, and we will send you a copy on
          request. If you tell us the balance came out wrong in your case, we will take that
          seriously rather than defensively — see the right to object below.
        </P>

        <H>Telling you we hold it — Article 14</H>
        <P>
          Because we obtained your details from a public source rather than from you, the UK GDPR
          requires us to tell you, at the latest within one month, or at the point of our first
          communication with you if that comes sooner. We satisfy that by linking this notice in the
          first message we send you, and by naming the source we used if you ask which one it was.
        </P>

        <H>The marketing rules we apply, channel by channel</H>
        <P>
          Direct marketing is governed not only by the UK GDPR but by the Privacy and Electronic
          Communications Regulations 2003 (PECR), which set different rules for different channels
          and for different kinds of recipient. We apply them as follows.
        </P>
        <Table
          head={['Channel', 'How we handle it']}
          rows={[
            [
              'Email to corporate addresses',
              <>
                PECR permits unsolicited marketing email to <strong>corporate subscribers</strong> —
                limited companies, LLPs, public bodies. We email only named business addresses at
                such organisations. Every message identifies {E.name} as the sender, gives a valid
                address to reply to, and carries a plain opt-out. We never disguise or conceal who
                we are.
              </>,
            ],
            [
              'Email to sole traders and partnerships',
              <>
                Sole traders and unincorporated partnerships count as{' '}
                <strong>individual subscribers</strong> under PECR and have the same protection as a
                private person. We do not send them marketing email without consent. Where we cannot
                tell from the public record which category a business falls into, we treat it as an
                individual subscriber — the cautious reading, deliberately.
              </>,
            ],
            [
              'Telephone',
              <>
                Before we call any number we screen it against the Telephone Preference Service and
                the Corporate Telephone Preference Service. We do not make marketing calls to
                registered numbers unless that specific organisation has told us it consents. We
                identify ourselves at the start of the call, we give a contact address on request,
                and we do not use automated dialling systems or pre-recorded messages.
              </>,
            ],
            [
              'LinkedIn and professional networks',
              <>
                Connection requests and messages sent as an ordinary user of the platform, within
                its terms. PECR does not govern this channel, but the UK GDPR does: we rely on the
                same legitimate interests assessment, keep the volume low and the relevance high,
                and stop on request.
              </>,
            ],
            [
              'Postal mail',
              <>
                Addressed post to a business address, under legitimate interests. You can object at
                any time and we will remove the address.
              </>,
            ],
          ]}
        />

        <H>Stopping us</H>
        <P>
          Your right to object to direct marketing is <strong>absolute</strong>. There is no
          balancing test and no discretion on our side: you say stop, we stop, and we do not ask you
          to justify it. One line to{' '}
          <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink> — or a reply to any
          message we have sent you — is enough for every channel at once.
        </P>
        <P>
          When you opt out we add the minimum identifying detail to a <strong>suppression list</strong>{' '}
          and keep it indefinitely. That sounds contradictory and is not: a suppression list is the
          only mechanism that reliably prevents your details being collected afresh from the same
          public source in a year’s time and the whole thing starting again. The list is used for
          nothing except not contacting you.
        </P>

        <H>Accuracy and retention</H>
        <P>
          Public records go stale. If we hold something about you that is wrong, tell us and we will
          correct it. Where a prospect record leads nowhere, we delete it{' '}
          <strong>twelve months after the last meaningful contact</strong> — we do not keep
          indefinite lists of businesses that never replied.
        </P>
      </>
    ),
  },

  /* ── 06 ─────────────────────────────────────────────── */
  {
    id: 'sharing',
    title: 'Who else sees your data',
    body: (
      <>
        <P>
          We keep the number of third parties involved deliberately small. Everyone listed below
          processes data on our instructions under a written contract, and none of them is permitted
          to use it for their own purposes.
        </P>
        <Table
          head={['Who', 'What for', 'Where']}
          rows={[
            [
              'Cloudflare, Inc.',
              'Hosting and delivery of this website, protection against attack, and cookieless aggregate analytics',
              'United States, with a global edge network',
            ],
            [
              'EmailJS',
              'Transporting the enquiry form to our inbox. The form contents pass through their service and are not retained by us there',
              'United States',
            ],
            [
              'Google LLC',
              'Serving the typefaces this site uses. Receives your IP address as an unavoidable consequence of your browser requesting the font files',
              'United States',
            ],
            [
              'Our business email and document provider',
              'Where correspondence, proposals and records actually live',
              'United Kingdom / European Union',
            ],
            [
              'Our accountants and professional advisers',
              'Statutory accounts, tax, and legal advice where required',
              'United Kingdom',
            ],
          ]}
        />
        <P>We will also disclose personal data where we have no lawful choice: to a court, a regulator, HMRC, or a law enforcement body acting under a valid power. We do not treat a request as valid merely because it arrives on headed paper, and we will tell you if we receive one about you unless we are legally forbidden from doing so.</P>
        <P>
          If the company is ever sold, merged or restructured, personal data may transfer as part of
          the business. Any buyer would be bound by this notice until they gave you a new one.
        </P>
      </>
    ),
  },

  /* ── 07 ─────────────────────────────────────────────── */
  {
    id: 'cookies',
    title: 'Cookies — and the fact that we do not use any',
    body: (
      <>
        <P>
          This website sets <strong>no cookies</strong>. Not analytics cookies, not advertising
          cookies, not preference cookies. It stores nothing in your browser’s local storage or
          session storage either. There is no consent banner on this site because there is nothing
          for you to consent to, and putting one up would be theatre.
        </P>
        <P>
          We measure traffic with <strong>Cloudflare Web Analytics</strong>, which was chosen
          specifically because it is cookieless: it does not store an identifier on your device, does
          not fingerprint your browser, and cannot follow you to any other website. What it gives us
          is a count of page views, the referring site, a country and a device category. Under PECR
          this requires no consent, because nothing is stored on or read from your equipment.
        </P>
        <P>
          There are no advertising pixels, no Meta pixel, no LinkedIn Insight tag, no Google
          Analytics, no session recording, no heatmaps and no third-party embeds beyond the font
          files described in clause 03. If that ever changes, this clause will change with it before
          the tracking goes live, not after.
        </P>
        <P>
          Our separate dashboard at socials.maxiai.co.uk does use cookies — it has to, in order to
          keep you signed in — and they are described in its own notice.
        </P>
      </>
    ),
  },

  /* ── 08 ─────────────────────────────────────────────── */
  {
    id: 'transfers',
    title: 'Where your data goes, and international transfers',
    body: (
      <>
        <P>
          Our records are held in the United Kingdom and the European Economic Area. Three of the
          providers in clause 06 — Cloudflare, EmailJS and Google — are United States companies, so
          some personal data is transferred outside the UK.
        </P>
        <P>Those transfers are made under one or both of the safeguards the UK recognises:</P>
        <Bullets
          items={[
            <>
              the <strong>UK Extension to the EU–US Data Privacy Framework</strong>, where the
              receiving organisation is certified under it; or
            </>,
            <>
              the <strong>International Data Transfer Agreement</strong>, or the EU Standard
              Contractual Clauses with the UK Addendum, together with a transfer risk assessment.
            </>,
          ]}
        />
        <P>
          In each case the effect is intended to be the same: the data carries its UK-level
          protection with it, and the provider is contractually bound to that standard. You can ask
          us which mechanism applies to a particular provider and we will tell you.
        </P>
      </>
    ),
  },

  /* ── 09 ─────────────────────────────────────────────── */
  {
    id: 'retention',
    title: 'How long we keep things',
    body: (
      <>
        <P>
          We keep personal data for no longer than the purpose requires. Where the law fixes a
          period, the law wins. Where it does not, these are the periods we have set ourselves.
        </P>
        <Table
          head={['Record', 'Kept for']}
          rows={[
            ['Aggregate website analytics', 'Retained by Cloudflare in aggregate form; contains no personal data we can tie to you'],
            ['Technical connection and security logs', 'Short-lived, and in the ordinary course no more than 30 days'],
            ['Enquiry form submissions and correspondence that goes nowhere', '24 months from the last message either way'],
            ['Prospect records where there was no engagement', '12 months from the last meaningful contact'],
            ['Suppression list (people who opted out)', 'Indefinitely — that is the point of it. Minimal data only'],
            ['Client contracts, proposals and project correspondence', '6 years after the engagement ends, matching the limitation period for contract claims'],
            ['Invoices and accounting records', '6 years from the end of the accounting period they fall in, as HMRC requires'],
            ['Unsuccessful job applications', '6 months, unless you ask us to keep them on file'],
          ]}
        />
        <P>
          At the end of a period we delete the record or irreversibly anonymise it. Backups roll off
          on their own cycle, which means a deleted record can persist in a backup for a short
          period after deletion from the live system; it is not restored to active use, and it goes
          when that backup expires.
        </P>
      </>
    ),
  },

  /* ── 10 ─────────────────────────────────────────────── */
  {
    id: 'security',
    title: 'How we protect it',
    body: (
      <>
        <P>
          We sell security work, so it would be awkward to be careless with our own. The measures
          are proportionate to a two-person company holding business contact details, not to a bank,
          and we would rather describe them accurately than impressively.
        </P>
        <Bullets
          items={[
            'The whole site is served over TLS; there is no unencrypted route to it.',
            'Access to systems holding personal data requires multi-factor authentication.',
            'Access is limited to the two founders, on the principle of least privilege — nobody has standing access to something they do not need.',
            'Devices are encrypted at rest, kept patched, and locked when unattended.',
            'Client system credentials are held in a password manager, never in documents, email or code.',
            'The enquiry form carries a spam trap rather than a third-party CAPTCHA, so no additional tracking is introduced to fight tracking.',
            'Backups are encrypted, and restoration is tested rather than assumed.',
          ]}
        />
        <P>
          No system is perfectly secure and we will not pretend otherwise. If a breach occurs that is
          likely to result in a risk to your rights and freedoms, we will report it to the ICO within
          72 hours of becoming aware of it, and where the risk is high we will tell you directly and
          plainly.
        </P>
      </>
    ),
  },

  /* ── 11 ─────────────────────────────────────────────── */
  {
    id: 'your-rights',
    title: 'Your rights, in full',
    body: (
      <>
        <P>
          The UK GDPR gives you the following rights. Some are qualified — they apply in defined
          circumstances rather than universally — and we have said so where that is the case rather
          than implying more than the law gives you.
        </P>
        <Bullets
          items={[
            <>
              <strong>Access.</strong> To be told whether we hold data about you, to receive a copy
              of it, and to be told why we hold it, who has seen it and how long we will keep it.
            </>,
            <>
              <strong>Rectification.</strong> To have inaccurate data corrected and incomplete data
              completed. Particularly relevant to data taken from public sources, which ages badly.
            </>,
            <>
              <strong>Erasure.</strong> To have data deleted where we no longer need it, where you
              withdraw the consent it rested on, or where you object and we have no overriding
              ground to continue. It does not extend to records we are legally required to keep,
              such as invoices.
            </>,
            <>
              <strong>Restriction.</strong> To have processing paused — for instance while a dispute
              about accuracy is resolved.
            </>,
            <>
              <strong>Portability.</strong> To receive data you gave us in a structured,
              machine-readable format, and to have it sent to another controller where technically
              feasible. Applies where processing rests on consent or contract and is automated.
            </>,
            <>
              <strong>Objection.</strong> To object to processing based on legitimate interests, on
              grounds relating to your situation. For <strong>direct marketing this right is
              absolute</strong> and takes effect immediately.
            </>,
            <>
              <strong>Withdrawal of consent.</strong> Where we rely on consent, to withdraw it at any
              time, without having to explain why.
            </>,
            <>
              <strong>Rights around automated decisions.</strong> Not to be subject to solely
              automated decisions with legal or similarly significant effects. We do not make any, so
              this right has nothing to bite on here — it is listed for completeness.
            </>,
          ]}
        />
        <H>How to exercise them</H>
        <P>
          Email <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink> or write to the
          registered office. You do not need to use a particular form of words, cite an article
          number, or explain yourself. We will:
        </P>
        <Bullets
          items={[
            'respond within one month, and tell you inside that month if a complex request needs the two-month extension the law allows;',
            'charge you nothing, unless a request is manifestly unfounded or excessive, in which case we will explain the charge before applying it;',
            'ask for proof of identity only where we genuinely cannot otherwise be confident it is you — and ask for the least intrusive proof that will do;',
            'tell you plainly if we are refusing part of a request, why, and how to challenge it.',
          ]}
        />
      </>
    ),
  },

  /* ── 12 ─────────────────────────────────────────────── */
  {
    id: 'complaints',
    title: 'If you are unhappy with how we have handled this',
    body: (
      <>
        <P>
          Please tell us first — most problems are a misunderstanding, and we can usually fix one
          faster than a regulator can. But you are not obliged to come to us first, and you do not
          lose anything by going straight to the regulator.
        </P>
        <P>
          You have the right to complain to the {ico.name}, the UK’s supervisory authority for data
          protection.
        </P>
        <Table
          head={['', '']}
          rows={[
            ['Post', ico.address.join(', ')],
            ['Helpline', ico.helpline],
            ['Online', <Alink href={ico.web}>{ico.webLabel}</Alink>],
          ]}
        />
        <P>
          You also have the right to an effective judicial remedy, and to seek compensation through
          the courts if you have suffered damage or distress as a result of a breach of data
          protection law.
        </P>
      </>
    ),
  },

  /* ── 13 ─────────────────────────────────────────────── */
  {
    id: 'changes',
    title: 'Changes to this notice',
    body: (
      <>
        <P>
          We will update this notice when what we do changes — a new provider, a new purpose, a new
          channel. The date at the head of the page is the date the current version took effect.
        </P>
        <P>
          Where a change materially affects you, and particularly where it would introduce tracking
          or a new purpose for data we already hold, we will make the change{' '}
          <strong>before</strong> the new processing begins and not retrospectively, and we will tell
          affected clients and contacts directly rather than relying on you to re-read this page.
        </P>
        <P>
          <strong>Version history.</strong> {legalUpdated} — first published.
        </P>
      </>
    ),
  },
];

function PrivacyEn() {
  return (
    <>
      <PageMeta route="/en/privacy" />

      <LegalHero
        eyebrow="Privacy"
        title={
          <>
            What we hold, why we hold it, and <em>how to make us stop.</em>
          </>
        }
        lead="A privacy notice is usually written to be legally sufficient and practically unreadable. This one is meant to be read by the person it concerns. If any part of it is unclear, that is a fault in our drafting and we would like to know about it."
        updated={legalUpdated}
        meta={[
          { label: 'Controller', value: E.name },
          { label: 'ICO registration', value: E.icoRegNo },
          { label: 'Company no.', value: E.companyNo },
        ]}
      />

      <LegalBody sections={sections} />

      <LegalFootNote>
        Anything in here that you want explained, challenged or acted on goes to{' '}
        <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink> and reaches a founder, not
        a ticket queue. The terms governing use of this website are set out separately in our{' '}
        <Xlink to="/en/tos">Terms of Service</Xlink>.
      </LegalFootNote>
    </>
  );
}

export default PrivacyEn;

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
import { legalEntity, legalUpdated } from '../../data/legal.js';
import { VAT_NOTE } from '../../data/site.js';

const E = legalEntity;

/**
 * Terms of service — website terms only.
 *
 * Scoped deliberately: this governs the use of maxiai.co.uk and nothing
 * else. Client engagements are governed by the signed contract for that
 * engagement, and clause 02 says so in terms, so that nobody can later
 * argue a page on a marketing site varied a commercial agreement.
 */

const sections = [
  /* ── 01 ─────────────────────────────────────────────── */
  {
    id: 'about',
    title: 'These terms, and your agreement to them',
    body: (
      <>
        <P>
          These are the terms on which you may use the website at <strong>{E.site}</strong> (the
          “site”). They form an agreement between you and {E.name}, a company registered in{' '}
          {E.jurisdiction} under number {E.companyNo}, whose registered office is at{' '}
          {E.registeredOffice.join(', ')}. In these terms “we”, “us” and “our” mean that company,
          and “you” means you, whether you are browsing on your own account or on behalf of an
          organisation.
        </P>
        <P>
          By using the site you accept these terms. If you do not accept them, please stop using the
          site — that is the whole of the remedy, on both sides. We have not put a banner in front of
          the content demanding that you click to agree, because we would rather you read the terms
          than dismiss them.
        </P>
        <P>
          If you are agreeing to these terms on behalf of a company or other organisation, you
          confirm you have authority to bind it, and “you” means that organisation.
        </P>
      </>
    ),
  },

  /* ── 02 ─────────────────────────────────────────────── */
  {
    id: 'scope',
    title: 'What these terms govern — and what they do not',
    body: (
      <>
        <P>
          These are <strong>website terms</strong>. They govern your use of this site and its
          content. They are not the terms on which we do work.
        </P>
        <H>Client engagements</H>
        <P>
          Any work we do for you — a website build, a care plan, a retainer, a security assessment,
          bespoke software, a place on the Studio Programme — is governed by the separate written
          agreement for that engagement: the proposal, statement of work, or contract we both sign.
          Where anything on this site differs from that agreement, the signed agreement prevails.
          Nothing on this site varies, supplements or overrides it.
        </P>
        <H>The invite-only dashboard</H>
        <P>
          Our social media dashboard at <strong>socials.maxiai.co.uk</strong> is a separate product
          with its own terms of service and its own privacy notice, provided to you when you are
          invited to it. These terms do not govern it.
        </P>
        <Note>
          Nothing on this site is an offer capable of acceptance. It is an invitation to talk. A
          contract between us comes into existence when we have both signed one, and not before.
        </Note>
      </>
    ),
  },

  /* ── 03 ─────────────────────────────────────────────── */
  {
    id: 'permitted-use',
    title: 'What you may do',
    body: (
      <>
        <P>
          You may access the site, read it, and use it for the purpose it exists for: to find out
          what we do, what we charge, and how to reach us.
        </P>
        <P>
          You may print or download extracts for your own reference, and you may share a link to any
          page anywhere you like. You may quote from the site in the ordinary way — in a tender
          document, a comparison, a piece of journalism, a post — provided the quotation is accurate,
          is attributed to {E.name}, and is not presented in a way that suggests we endorse something
          we have not seen.
        </P>
        <P>
          We provide the site free of charge. We do not require you to register, create an account,
          or identify yourself to read any part of it.
        </P>
      </>
    ),
  },

  /* ── 04 ─────────────────────────────────────────────── */
  {
    id: 'prohibited-use',
    title: 'What you may not do',
    body: (
      <>
        <P>You must not:</P>
        <Bullets
          items={[
            'use the site for any unlawful, fraudulent or harmful purpose, or in breach of any applicable law or regulation;',
            'copy, republish or redistribute substantial parts of the site’s content as your own, or reproduce it in a commercial product or a competing offering;',
            'systematically extract, scrape or harvest content or data from the site, whether by automated means or otherwise, in order to build a database, a mailing list, a training corpus or a derived service, without our prior written consent;',
            'introduce any virus, worm, logic bomb, trojan or other material that is malicious or technologically harmful;',
            'attempt to gain unauthorised access to the site, the server it sits on, or any system connected to it — including by probing, scanning, penetration testing or exploiting vulnerabilities — unless we have authorised it in writing beforehand;',
            'attack the site by means of a denial-of-service or distributed denial-of-service attack, or otherwise deliberately interfere with its availability;',
            'use the site to transmit unsolicited advertising or promotional material, or to send anything defamatory, obscene, harassing or in breach of another person’s rights;',
            'frame, mirror or deep-link the site in a way that misrepresents its origin or associates us with a product, service or view we have not endorsed;',
            'remove, obscure or alter any copyright, trademark or other proprietary notice.',
          ]}
        />
        <P>
          On security testing specifically: we build security work for a living and we have no
          hostility to researchers. If you believe you have found a vulnerability in this site, we
          would genuinely like to hear about it — write to{' '}
          <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink> with the details, give us
          a reasonable opportunity to fix it before disclosing it publicly, and do not access,
          modify or exfiltrate any data that is not your own. Do that and you will get a thank you
          rather than a solicitor’s letter.
        </P>
        <P>
          A breach of this clause may be a criminal offence under the Computer Misuse Act 1990. We
          will report any such breach to the relevant law enforcement authorities and cooperate with
          them, including by disclosing your identity where we lawfully can.
        </P>
      </>
    ),
  },

  /* ── 05 ─────────────────────────────────────────────── */
  {
    id: 'ip',
    title: 'Intellectual property',
    body: (
      <>
        <P>
          We own, or are licensed to use, all intellectual property rights in the site and in the
          material published on it: the text, the layout and design, the graphics, the logo and
          lockup, the photography, and the underlying code. Those rights are protected by copyright
          and trade mark laws and are reserved.
        </P>
        <P>
          Your use of the site does not transfer any of those rights to you. Clause 03 sets out the
          limited permission you do have; beyond that, you need our written consent.
        </P>
        <P>
          “Maxi AI Development” and the Maxi lockup are our marks. Any other company, product or
          service name on the site belongs to whoever owns it, and is used descriptively, without any
          claim to it and without implying an affiliation or endorsement in either direction.
        </P>
      </>
    ),
  },

  /* ── 06 ─────────────────────────────────────────────── */
  {
    id: 'submissions',
    title: 'What you send us through the site',
    body: (
      <>
        <P>
          The site has one input: the enquiry form. When you use it, or when you email us at an
          address published here:
        </P>
        <Bullets
          items={[
            'you confirm that what you tell us is accurate, and that you are entitled to send it — including any information about a third party;',
            'you accept that ordinary email is not a secure channel, and that we cannot guarantee the confidentiality of anything in transit to us;',
            'you should not send confidential, commercially sensitive or legally privileged material in a first approach. Send us enough to have a conversation, and we will agree a proper route for the rest;',
            'no non-disclosure obligation arises simply because you sent us something. If you need one, ask, and we will sign a sensible NDA before the detailed conversation rather than after it;',
            'you must not send special category personal data — health, ethnicity, religion, political opinion, trade union membership, sexual orientation, genetic or biometric data — through the form. We do not need it and do not want to hold it.',
          ]}
        />
        <P>
          If you send us an unsolicited idea, concept or proposal, we cannot promise to treat it as
          confidential and we cannot promise that we are not already working on something similar.
          Nothing in this clause is meant to be sharp practice — it exists so that neither of us ends
          up in an argument about an email.
        </P>
        <P>
          How we handle the personal data in your message is set out in our{' '}
          <Xlink to="/en/privacy">Privacy Notice</Xlink>.
        </P>
      </>
    ),
  },

  /* ── 07 ─────────────────────────────────────────────── */
  {
    id: 'information',
    title: 'The information on this site is not advice',
    body: (
      <>
        <P>
          The site describes what we do and sets out our views on how software, security and
          infrastructure work should be approached. It is published for general information. It is
          not professional advice, and it is not tailored to your circumstances, your estate, your
          regulatory position or your risk.
        </P>
        <P>
          Do not act, or refrain from acting, on the strength of anything on this site alone. Nothing
          here — including anything we write about Cyber Essentials, security posture, compliance or
          infrastructure — creates a professional relationship between us, and we accept no liability
          for decisions taken on the basis of it. If you want advice that you can rely on, engage us,
          and it will be given under a contract that says so.
        </P>
      </>
    ),
  },

  /* ── 08 ─────────────────────────────────────────────── */
  {
    id: 'pricing',
    title: 'Prices shown on this site',
    body: (
      <>
        <P>
          We publish our prices, which most studios of our size do not, and we would like them to
          keep meaning something. So, to be exact about their status:
        </P>
        <Table
          head={['', '']}
          rows={[
            ['What they are', 'Indicative prices and starting points for the work described, current at the date shown at the head of this page'],
            ['What they are not', 'A quotation, an offer, or a guaranteed price for your particular project'],
            ['VAT', VAT_NOTE],
            ['Changes', 'We may change published prices at any time. A change does not affect a price we have already quoted you in writing, or the price agreed in a signed engagement'],
            ['Errors', 'If a price is published in obvious error we are not bound by it, and we will correct it rather than argue about it'],
          ]}
        />
        <P>
          Where the site describes an offer with limited places — the Studio Programme, for instance
          — availability is limited and stated in good faith at the time of writing. Describing it
          here does not oblige us to accept any particular applicant, and the terms of that
          arrangement are set out in the agreement you sign if we take you on.
        </P>
      </>
    ),
  },

  /* ── 09 ─────────────────────────────────────────────── */
  {
    id: 'availability',
    title: 'Availability of the site, and no warranty',
    body: (
      <>
        <P>
          We take reasonable care to keep the site accurate and available, but we provide it{' '}
          <strong>“as is”</strong> and <strong>“as available”</strong>. To the fullest extent
          permitted by law, we exclude all warranties, conditions and representations that are not
          expressly set out in these terms, whether implied by statute, common law or otherwise.
        </P>
        <P>In particular, we do not warrant that:</P>
        <Bullets
          items={[
            'the site will be available uninterrupted, or free from error, virus or defect;',
            'the content is complete, current or accurate at any given moment — we may suspend, withdraw or change any part of it without notice and without liability;',
            'the site is suitable or available for use in any particular jurisdiction. We are a UK company and the site is directed at the United Kingdom, Sweden, Malta and Hong Kong; if you access it elsewhere, you are responsible for compliance with your own local law.',
          ]}
        />
      </>
    ),
  },

  /* ── 10 ─────────────────────────────────────────────── */
  {
    id: 'links',
    title: 'Links to other sites',
    body: (
      <>
        <P>
          Where the site links to a third-party website or resource, the link is provided for
          information only. We do not control those sites, we do not endorse them, and we accept no
          responsibility for their content, their accuracy, their availability or what they do with
          your data. Follow them on your own judgement, and read their terms and privacy notices
          rather than assuming ours apply.
        </P>
      </>
    ),
  },

  /* ── 11 ─────────────────────────────────────────────── */
  {
    id: 'liability',
    title: 'Our liability to you',
    body: (
      <>
        <P>
          Nothing in these terms limits or excludes our liability for death or personal injury caused
          by our negligence, for fraud or fraudulent misrepresentation, or for anything else that
          cannot lawfully be limited or excluded. That carve-out comes first because it is the part
          that matters most.
        </P>
        <H>If you are using the site for business purposes</H>
        <P>Subject to the paragraph above, we will not be liable to you for:</P>
        <Bullets
          items={[
            'loss of profits, sales, business or revenue;',
            'business interruption, or loss of anticipated savings;',
            'loss of business opportunity, goodwill or reputation;',
            'any indirect or consequential loss;',
            'loss or corruption of data, where it arises from your use of, or inability to use, this site.',
          ]}
        />
        <P>
          Subject always to the first paragraph of this clause, our total aggregate liability to you
          arising out of or in connection with your use of this site — in contract, tort (including
          negligence), breach of statutory duty or otherwise — is limited to{' '}
          <strong>£100</strong>. That figure reflects the reality that this is an informational
          website provided free of charge; liability for work we are actually engaged to do is dealt
          with in the contract for that work, at a level appropriate to it, and is not affected by
          this clause.
        </P>
        <H>If you are a consumer</H>
        <P>
          Nothing in these terms affects your statutory rights. We are liable to you for loss or
          damage that is a foreseeable result of our breaking these terms or failing to use
          reasonable care and skill, but not for loss that is unforeseeable. We do not exclude our
          liability under the Consumer Rights Act 2015 or the Consumer Protection Act 1987.
        </P>
        <P>
          We are not liable for loss or damage caused by a virus or other technologically harmful
          material that infects your equipment through your use of the site or anything downloaded
          from it. You are responsible for configuring your own equipment and anti-virus protection.
        </P>
      </>
    ),
  },

  /* ── 12 ─────────────────────────────────────────────── */
  {
    id: 'indemnity',
    title: 'Your liability to us',
    body: (
      <>
        <P>
          If you use the site in breach of clause 04 — unlawfully, maliciously, or to attack it —
          you will indemnify us against any losses, damages, costs and reasonable legal expenses we
          incur as a result. This clause is aimed squarely at deliberate misuse. It is not intended
          to catch an ordinary visitor reading the site in good faith, and we will not use it that
          way.
        </P>
      </>
    ),
  },

  /* ── 13 ─────────────────────────────────────────────── */
  {
    id: 'privacy',
    title: 'Privacy and cookies',
    body: (
      <>
        <P>
          How we handle personal data is set out in our{' '}
          <Xlink to="/en/privacy">Privacy Notice</Xlink>, which forms part of your use of this site
          and which you should read alongside these terms.
        </P>
        <P>
          In short: this site sets no cookies, shows no consent banner because it has nothing to ask
          consent for, uses cookieless aggregate analytics, and runs no advertising or tracking
          pixels. The notice explains all of that, and explains separately how we handle publicly
          available business contact information when we approach companies about our services.
        </P>
      </>
    ),
  },

  /* ── 14 ─────────────────────────────────────────────── */
  {
    id: 'changes',
    title: 'Changes to the site and to these terms',
    body: (
      <>
        <P>
          We may amend these terms at any time. The version in force is the one published here, and
          the date at the head of the page is the date it took effect. Your continued use of the site
          after a change means you accept the amended terms, so it is worth checking this page from
          time to time — though in practice a marketing site’s terms change rarely.
        </P>
        <P>
          We may also update, suspend or withdraw the site, or any part of it, without notice. We
          will try not to do so without good reason, but we do not guarantee continuous availability
          and we are not liable if the site is unavailable at any time or for any period.
        </P>
        <P>
          <strong>Version history.</strong> {legalUpdated} — first published.
        </P>
      </>
    ),
  },

  /* ── 15 ─────────────────────────────────────────────── */
  {
    id: 'general',
    title: 'General',
    body: (
      <>
        <Bullets
          items={[
            <>
              <strong>Entire agreement.</strong> These terms, together with the Privacy Notice,
              constitute the entire agreement between us in relation to your use of this site, and
              replace anything said or written about it beforehand.
            </>,
            <>
              <strong>Severance.</strong> If any provision is found to be unlawful or unenforceable,
              it is severed and the rest remains in force.
            </>,
            <>
              <strong>Waiver.</strong> If we delay in enforcing a provision, or do not enforce it on
              one occasion, that is not a waiver of it and does not prevent us enforcing it later.
            </>,
            <>
              <strong>Assignment.</strong> We may transfer our rights and obligations under these
              terms to another organisation, for instance if the business is sold. You may not
              transfer yours without our written consent.
            </>,
            <>
              <strong>Third parties.</strong> No one other than you and us has any right to enforce
              these terms under the Contracts (Rights of Third Parties) Act 1999.
            </>,
            <>
              <strong>Events outside our control.</strong> We are not liable for any failure or delay
              caused by something beyond our reasonable control, including the failure of a hosting,
              network or infrastructure provider.
            </>,
          ]}
        />
      </>
    ),
  },

  /* ── 16 ─────────────────────────────────────────────── */
  {
    id: 'law',
    title: 'Governing law and jurisdiction',
    body: (
      <>
        <P>
          These terms, their subject matter and their formation — including any non-contractual
          dispute or claim arising out of them — are governed by the law of England and Wales.
        </P>
        <P>
          We and you both agree that the courts of England and Wales have exclusive jurisdiction over
          any dispute arising from these terms or your use of the site. If you are a consumer
          resident elsewhere in the United Kingdom, you may also bring proceedings in the courts of
          the part of the UK where you live, and you keep the benefit of any mandatory protections of
          the law of your country of residence.
        </P>
        <P>
          We work with clients in Sweden, Malta and Hong Kong, and we are glad to. It does not change
          the governing law of this website.
        </P>
      </>
    ),
  },

  /* ── 17 ─────────────────────────────────────────────── */
  {
    id: 'contact',
    title: 'How to contact us about these terms',
    body: (
      <>
        <P>
          Write to <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink>, or by post to{' '}
          {E.name}, {E.registeredOffice.join(', ')}. If you would rather just talk about a piece of
          work, the <Xlink to="/en/contact-us">contact page</Xlink> is the shorter route.
        </P>
      </>
    ),
  },
];

function TosEn() {
  return (
    <>
      <PageMeta route="/en/tos" />

      <LegalHero
        eyebrow="Terms of Service"
        title={
          <>
            The terms on which you use <em>this website.</em>
          </>
        }
        lead="These govern the site and nothing more. The work we do for clients is governed by the agreement we both sign for that work, and no page here varies it. Short, specific, and free of the clauses that exist only to make a document look serious."
        updated={legalUpdated}
        meta={[
          { label: 'Applies to', value: E.site },
          { label: 'Governing law', value: 'England and Wales' },
          { label: 'Company no.', value: E.companyNo },
        ]}
      />

      <LegalBody sections={sections} />

      <LegalFootNote>
        These terms cover the website. How we handle personal data — including business contact
        details we find in public sources — is set out in the{' '}
        <Xlink to="/en/privacy">Privacy Notice</Xlink>, and questions about either reach a founder
        at <Alink href={`mailto:${E.privacyEmail}`}>{E.privacyEmail}</Alink>.
      </LegalFootNote>
    </>
  );
}

export default TosEn;

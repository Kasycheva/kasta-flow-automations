import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";

type LegalPageKind = "privacy" | "cookies" | "terms";

type LegalSection = {
  title: string;
  body: string[];
};

const content: Record<"en" | "no", Record<LegalPageKind, {
  title: string;
  description: string;
  updated: string;
  back: string;
  sections: LegalSection[];
}>> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      description: "How Kasta Flow Studio collects and uses personal data when you contact us or use this website.",
      updated: "Last updated: April 2026",
      back: "Back to home",
      sections: [
        {
          title: "Who we are",
          body: [
            "Kasta Flow Studio provides business automation, AI assistant and integration services for businesses in Norway. You can contact us at kastaflow.studio@gmail.com.",
          ],
        },
        {
          title: "What we collect",
          body: [
            "When you send a request, we may collect your name, email address, phone number, company name, selected services, preferred contact channel and the information you write or record in the form.",
            "If you use the chat or voice form, we may process the conversation transcript or voice transcription so we can understand and respond to your request.",
          ],
        },
        {
          title: "Why we use the data",
          body: [
            "We use your information to respond to your request, prepare a relevant proposal, communicate with you, improve our services and keep a record of business communication.",
            "The legal basis is your consent, our legitimate interest in responding to business inquiries, and steps taken before entering into a service agreement.",
          ],
        },
        {
          title: "Service providers",
          body: [
            "We may use trusted service providers to operate the website and process requests, including hosting providers, Formsubmit for form delivery, Google/Gemini services for chat or transcription features, and communication platforms selected by you.",
            "We do not sell your personal data.",
          ],
        },
        {
          title: "How long we keep data",
          body: [
            "We keep inquiry and communication data only as long as needed to respond, follow up, document agreed work and meet legal or accounting obligations.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "You may ask for access, correction, deletion, restriction or objection to processing of your personal data. You may also withdraw consent where processing is based on consent.",
            "To use these rights, contact us at kastaflow.studio@gmail.com.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description: "Terms for using Kasta Flow Studio's website and requesting automation services.",
      updated: "Last updated: April 2026",
      back: "Back to home",
      sections: [
        {
          title: "About these terms",
          body: [
            "These terms apply when you use this website, contact Kasta Flow Studio or request a proposal for automation, AI assistant, CRM, integration or support services.",
          ],
        },
        {
          title: "Prices and proposals",
          body: [
            "Prices shown on the website are starting prices in NOK excluding VAT. The final price depends on the scope, complexity, third-party tools, integrations and timeline.",
            "A project starts only after we agree on scope, price and payment terms in writing.",
          ],
        },
        {
          title: "Third-party tools",
          body: [
            "Some projects require third-party tools such as CRM systems, n8n, OpenAI/Gemini APIs, Vipps, Fiken, hosting or other subscriptions. Unless agreed otherwise, these are paid separately by the client.",
          ],
        },
        {
          title: "Communication and delivery",
          body: [
            "We usually work asynchronously and in writing. Delivery timelines depend on timely access, information and feedback from the client.",
          ],
        },
        {
          title: "Results and liability",
          body: [
            "We aim to build reliable and useful systems, but we do not guarantee specific revenue, savings or business outcomes. Our liability is limited to the amount paid for the relevant service unless mandatory law says otherwise.",
          ],
        },
        {
          title: "Contact",
          body: [
            "Questions about these terms can be sent to kastaflow.studio@gmail.com.",
          ],
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      description: "How Kasta Flow Studio uses necessary, analytics and marketing cookies.",
      updated: "Last updated: April 2026",
      back: "Back to home",
      sections: [
        {
          title: "What cookies are",
          body: [
            "Cookies and similar technologies are small pieces of information stored on or read from your device when you use a website.",
          ],
        },
        {
          title: "Necessary cookies",
          body: [
            "Necessary cookies and storage are used to remember your cookie choice, keep form and chat functionality working during your visit, and support basic website operation. These are not used for advertising.",
          ],
        },
        {
          title: "Analytics cookies",
          body: [
            "If you consent, we may use Google Analytics to understand how visitors use the website, which pages are viewed and how the site can be improved.",
            "Analytics tools are not loaded unless you accept analytics cookies.",
          ],
        },
        {
          title: "Marketing cookies",
          body: [
            "If you consent, we may use Meta Pixel or similar marketing tools to measure campaigns and understand whether our advertising reaches relevant audiences.",
            "Marketing tools are not loaded unless you accept marketing cookies.",
          ],
        },
        {
          title: "Changing your choice",
          body: [
            "You can change or withdraw your cookie choice at any time by using the Cookie settings link in the footer.",
          ],
        },
      ],
    },
  },
  no: {
    privacy: {
      title: "Personvernerklaring",
      description: "Hvordan Kasta Flow Studio samler inn og bruker personopplysninger når du kontakter oss eller bruker nettsiden.",
      updated: "Sist oppdatert: april 2026",
      back: "Til forsiden",
      sections: [
        {
          title: "Hvem vi er",
          body: [
            "Kasta Flow Studio leverer automatisering, AI-assistenter og integrasjoner for bedrifter i Norge. Du kan kontakte oss på kastaflow.studio@gmail.com.",
          ],
        },
        {
          title: "Hva vi samler inn",
          body: [
            "Når du sender en forespørsel, kan vi samle inn navn, e-postadresse, telefonnummer, firmanavn, valgte tjenester, foretrukket kontaktkanal og informasjonen du skriver eller spiller inn i skjemaet.",
            "Hvis du bruker chatten eller stemmeskjemaet, kan vi behandle samtalehistorikk eller transkripsjon for å forstå og svare på forespørselen din.",
          ],
        },
        {
          title: "Hvorfor vi bruker opplysningene",
          body: [
            "Vi bruker opplysningene til å svare på forespørselen, lage et relevant tilbud, kommunisere med deg, forbedre tjenestene våre og dokumentere forretningskommunikasjon.",
            "Behandlingsgrunnlaget er ditt samtykke, vår berettigede interesse i å svare på henvendelser, og tiltak for å kunne inngå en eventuell avtale.",
          ],
        },
        {
          title: "Leverandører",
          body: [
            "Vi kan bruke betrodde leverandører for drift av nettsiden og behandling av henvendelser, inkludert hosting, Formsubmit for skjema, Google/Gemini-tjenester for chat eller transkripsjon og kommunikasjonsplattformer du selv velger.",
            "Vi selger ikke personopplysningene dine.",
          ],
        },
        {
          title: "Hvor lenge vi lagrer data",
          body: [
            "Vi lagrer henvendelser og kommunikasjon bare så lenge det er nødvendig for å svare, følge opp, dokumentere avtalt arbeid og oppfylle lov- eller regnskapskrav.",
          ],
        },
        {
          title: "Dine rettigheter",
          body: [
            "Du kan be om innsyn, retting, sletting, begrensning eller protest mot behandling av personopplysningene dine. Du kan også trekke tilbake samtykke der behandlingen er basert på samtykke.",
            "Kontakt oss på kastaflow.studio@gmail.com for å bruke rettighetene dine.",
          ],
        },
      ],
    },
    terms: {
      title: "Vilkår",
      description: "Vilkår for bruk av Kasta Flow Studios nettside og forespørsler om automatiseringstjenester.",
      updated: "Sist oppdatert: april 2026",
      back: "Til forsiden",
      sections: [
        {
          title: "Om disse vilkårene",
          body: [
            "Disse vilkårene gjelder når du bruker nettsiden, kontakter Kasta Flow Studio eller ber om tilbud på automatisering, AI-assistenter, CRM, integrasjoner eller support.",
          ],
        },
        {
          title: "Priser og tilbud",
          body: [
            "Prisene på nettsiden er startpriser i NOK ekskl. MVA. Endelig pris avhenger av omfang, kompleksitet, tredjepartsverktøy, integrasjoner og tidslinje.",
            "Et prosjekt starter kun etter at vi har avtalt omfang, pris og betalingsbetingelser skriftlig.",
          ],
        },
        {
          title: "Tredjepartsverktøy",
          body: [
            "Noen prosjekter krever tredjepartsverktøy som CRM-systemer, n8n, OpenAI/Gemini API-er, Vipps, Fiken, hosting eller andre abonnementer. Med mindre annet er avtalt, betales disse separat av kunden.",
          ],
        },
        {
          title: "Kommunikasjon og levering",
          body: [
            "Vi jobber vanligvis asynkront og skriftlig. Leveringstid avhenger av at kunden gir nødvendig tilgang, informasjon og tilbakemelding i tide.",
          ],
        },
        {
          title: "Resultater og ansvar",
          body: [
            "Vi jobber for å bygge stabile og nyttige systemer, men garanterer ikke bestemte inntekter, besparelser eller forretningsresultater. Vårt ansvar er begrenset til beløpet som er betalt for den relevante tjenesten, med mindre ufravikelig lov sier noe annet.",
          ],
        },
        {
          title: "Kontakt",
          body: [
            "Spørsmål om disse vilkårene kan sendes til kastaflow.studio@gmail.com.",
          ],
        },
      ],
    },
    cookies: {
      title: "Informasjonskapsler",
      description: "Hvordan Kasta Flow Studio bruker nødvendige informasjonskapsler, analyse og markedsføring.",
      updated: "Sist oppdatert: april 2026",
      back: "Til forsiden",
      sections: [
        {
          title: "Hva informasjonskapsler er",
          body: [
            "Informasjonskapsler og lignende teknologi er små opplysninger som lagres på eller leses fra enheten din når du bruker en nettside.",
          ],
        },
        {
          title: "Nødvendige informasjonskapsler",
          body: [
            "Nødvendige informasjonskapsler og lagring brukes for å huske cookie-valget ditt, holde skjema og chat i gang under besøket og støtte grunnleggende drift av nettsiden. Disse brukes ikke til annonsering.",
          ],
        },
        {
          title: "Analyse",
          body: [
            "Hvis du samtykker, kan vi bruke Google Analytics for å forstå hvordan besøkende bruker nettsiden, hvilke sider som vises og hvordan siden kan forbedres.",
            "Analyseverktøy lastes ikke før du godtar analyse.",
          ],
        },
        {
          title: "Markedsføring",
          body: [
            "Hvis du samtykker, kan vi bruke Meta Pixel eller lignende markedsføringsverktøy for å måle kampanjer og forstå om annonseringen vår når relevante målgrupper.",
            "Markedsføringsverktøy lastes ikke før du godtar markedsføring.",
          ],
        },
        {
          title: "Endre valget ditt",
          body: [
            "Du kan endre eller trekke tilbake cookie-valget ditt når som helst via Cookie settings-lenken i footeren.",
          ],
        },
      ],
    },
  },
};

export default function LegalPage({ kind }: { kind: LegalPageKind }) {
  const { i18n } = useTranslation();
  const language = i18n.language === "no" ? "no" : "en";
  const page = content[language][kind];
  const switchLanguage = (nextLanguage: "en" | "no") => {
    localStorage.setItem("kasta-language", nextLanguage);
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground md:px-8 md:py-12">
      <Seo title={`${page.title} | Kasta Flow Studio`} description={page.description} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {page.back}
          </Link>
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => switchLanguage("en")}
              className={`px-2 py-1 transition-colors ${language === "en" ? "text-foreground" : "text-muted-foreground"}`}
            >
              EN
            </button>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => switchLanguage("no")}
              className={`px-2 py-1 transition-colors ${language === "no" ? "text-foreground" : "text-muted-foreground"}`}
            >
              NO
            </button>
          </div>
        </div>

        <header className="mb-10 border-b border-border pb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Kasta Flow Studio
          </p>
          <h1 className="text-4xl font-heading font-bold text-foreground md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">{page.updated}</p>
        </header>

        <div className="space-y-9">
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-xl font-heading font-semibold text-foreground">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-muted-foreground md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

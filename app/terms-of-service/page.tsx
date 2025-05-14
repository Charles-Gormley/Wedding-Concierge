import Link from "next/link"

export default function TermsOfService() {
  const tableOfContents = [
    { href: "#our-services", text: "Our Services" },
    { href: "#intellectual-property-rights", text: "Intellectual Property Rights" },
    { href: "#user-representations", text: "User Representations" },
    { href: "#purchases-and-payment", text: "Purchases and Payment" },
    { href: "#policy", text: "Policy" },
    { href: "#prohibited-activities", text: "Prohibited Activities" },
    { href: "#user-generated-contributions", text: "User Generated Contributions" },
    { href: "#contribution-license", text: "Contribution License" },
    { href: "#services-management", text: "Services Management" },
    { href: "#privacy-policy", text: "Privacy Policy" },
    { href: "#term-and-termination", text: "Term and Termination" },
    { href: "#modifications-and-interruptions", text: "Modifications and Interruptions" },
    { href: "#governing-law", text: "Governing Law" },
    { href: "#dispute-resolution", text: "Dispute Resolution" },
    { href: "#corrections", text: "Corrections" },
    { href: "#disclaimer", text: "Disclaimer" },
    { href: "#limitations-of-liability", text: "Limitations of Liability" },
    { href: "#indemnification", text: "Indemnification" },
    { href: "#user-data", text: "User Data" },
    { href: "#electronic-communications", text: "Electronic Communications, Transactions, and Signatures" },
    { href: "#sms-text-messaging", text: "SMS Text Messaging" },
    { href: "#california-users", text: "California Users and Residents" },
    { href: "#miscellaneous", text: "Miscellaneous" },
    { href: "#contact-us", text: "Contact Us" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-light mb-4">TERMS OF USE</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 24, 2025</p>

        <p className="mb-6">
          We are <strong>Heliogram LLC</strong>, doing business as <strong>Heliogram</strong> (the "Company", "we",
          "us", "our"). We operate the website{" "}
          <a
            href="https://www.wedding-concierge.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            https://www.wedding-concierge.com/
          </a>{" "}
          (the "Site") and all related products and services (collectively, the "Services").
        </p>

        <div className="bg-gray-50 dark:bg-charcoal-light border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8">
          <p className="text-sm dark:text-gray-300">
            <strong>Note:</strong> The Services are intended for users who are at least 13 years of age. All users who
            are minors (generally under the age of 18) must have the permission of and be directly supervised by their
            parent or guardian. We recommend that you print a copy of these Legal Terms for your records.
          </p>
        </div>

        <h2 className="text-2xl font-light mt-8 mb-4">Table of Contents</h2>
        <ol className="list-decimal list-inside space-y-2 mb-8">
          {tableOfContents.map((item, index) => (
            <li key={index}>
              <a href={item.href} className="text-black dark:text-gray-200 hover:text-gray-600 dark:hover:text-white">
                {item.text}
              </a>
            </li>
          ))}
        </ol>

        <section id="our-services" className="mb-8">
          <h2 className="text-2xl font-light mb-4">1. Our Services</h2>
          <p>
            The information provided when using the Services is not intended for distribution to or use by any person or
            entity in any jurisdiction or country where such use would be contrary to law or regulation. If you access
            the Services from other locations, you do so at your own initiative and are solely responsible for complying
            with local laws.
          </p>
          <p className="mt-4">
            The Services are <strong>not tailored</strong> to comply with industry-specific regulations (e.g., HIPAA,
            FISMA). Accordingly, if your interactions would be subject to such laws (for example, the Gramm-Leach-Bliley
            Act), you may not use the Services.
          </p>
        </section>

        <section id="intellectual-property-rights" className="mb-8">
          <h2 className="text-2xl font-light mb-4">2. Intellectual Property Rights</h2>
          <h3 className="text-xl font-light mb-3">Our Intellectual Property</h3>
          <p>
            We are the owner or the licensee of all intellectual property rights in our Services, including but not
            limited to all source code, databases, functionality, software, website designs, audio, video, text,
            photographs, and graphics (collectively, the "Content"), as well as the trademarks, service marks, and logos
            (the "Marks").
          </p>
          <h3 className="text-xl font-light mt-4 mb-3">Your Use of Our Services</h3>
          <p>
            Subject to your compliance with these Legal Terms—including the Prohibited Activities section—we grant you a
            non-exclusive, non-transferable, revocable license to:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access the Services; and</li>
            <li>
              Download or print a copy of any portion of the Content to which you have proper access, solely for your
              internal business purposes.
            </li>
          </ul>
        </section>
        <section id="user-representations" className="mb-8">
          <h2 className="text-2xl font-light mb-4">3. User Representations</h2>
          <p>By using the Services, you represent and warrant that:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>You have the legal capacity to enter into these Legal Terms and agree to comply with them;</li>
            <li>You are not under the age of 13;</li>
            <li>
              You are not a minor in the jurisdiction in which you reside (or if you are, you have obtained parental
              permission to use the Services);
            </li>
            <li>You will not access the Services through automated or non-human means (e.g., bots or scripts);</li>
            <li>You will not use the Services for any illegal or unauthorized purpose; and</li>
            <li>Your use of the Services will comply with all applicable laws and regulations.</li>
          </ol>
          <p className="mt-4">
            If you provide any information that is untrue, inaccurate, or incomplete, we reserve the right to suspend or
            terminate your account and deny any current or future use of the Services.
          </p>
        </section>

        <section id="purchases-and-payment" className="mb-8">
          <h2 className="text-2xl font-light mb-4">4. Purchases and Payment</h2>
          <p>
            <strong>Accepted Forms of Payment:</strong> PayPal.
          </p>
          <p className="mt-4">
            You agree to provide current, complete, and accurate purchase and account information for all transactions
            made via the Services. You are responsible for updating your account and payment information as needed.
            Sales tax will be added as required, and all payments shall be in <strong>US dollars</strong>.
          </p>
          <p className="mt-4">
            You authorize us to charge your chosen payment provider upon placing your order. We reserve the right to
            correct any pricing errors or mistakes—even if we have already received payment—and to refuse any order at
            our sole discretion.
          </p>
        </section>

        <section id="policy" className="mb-8">
          <h2 className="text-2xl font-light mb-4">5. Policy</h2>
          <p>All sales are final. No refunds will be issued.</p>
        </section>

        <section id="prohibited-activities" className="mb-8">
          <h2 className="text-2xl font-light mb-4">6. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              Systematically retrieve data or content from the Services to create a compilation, database, or directory
              without our written permission.
            </li>
            <li>Trick, defraud, or mislead us or other users, especially to obtain sensitive account information.</li>
            <li>Circumvent, disable, or interfere with security-related features of the Services.</li>
            <li>Disparage, tarnish, or harm our reputation or the Services.</li>
            <li>Use any information from the Services to harass, abuse, or harm any person.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Violate any applicable laws or regulations.</li>
            <li>Engage in unauthorized framing or linking to the Services.</li>
            <li>Upload or transmit viruses, Trojan horses, or other harmful materials.</li>
            <li>Use any automated system (e.g., bots or scripts) to access or collect data from the Services.</li>
            <li>Remove copyright or proprietary notices from any Content.</li>
            <li>Impersonate another user or use another user’s username.</li>
            <li>
              Employ any passive or active information collection mechanisms (e.g., web bugs, cookies) without consent.
            </li>
            <li>Interfere with the operation or security of the Services.</li>
            <li>Reverse engineer, decompile, or disassemble any software that comprises part of the Services.</li>
            <li>Collect usernames or email addresses for unsolicited communications.</li>
            <li>Use the Services to compete with us or for any revenue-generating commercial endeavor.</li>
          </ul>
        </section>

        <section id="user-generated-contributions" className="mb-8">
          <h2 className="text-2xl font-light mb-4">7. User Generated Contributions</h2>
          <p>
            The Services may give you the opportunity to create, submit, post, display, transmit, perform, publish,
            distribute, or broadcast content and materials (collectively, "Contributions"). When you make Contributions,
            you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your Contributions do not infringe any third-party intellectual property or proprietary rights;</li>
            <li>You are the creator of your Contributions or have obtained all necessary rights and permissions;</li>
            <li>
              You have obtained necessary consent from any identifiable individuals included in your Contributions;
            </li>
            <li>Your Contributions are not false, inaccurate, or misleading;</li>
            <li>
              Your Contributions are not unsolicited, unauthorized advertising, spam, or other forms of solicitation;
            </li>
            <li>
              Your Contributions are not obscene, lewd, violent, harassing, libelous, slanderous, or otherwise
              objectionable;
            </li>
            <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone;</li>
            <li>Your Contributions comply with all applicable laws.</li>
          </ul>
          <p className="mt-4">
            Any use of the Services that violates the above may result in the termination or suspension of your rights
            to use the Services.
          </p>
        </section>

        <section id="contribution-license" className="mb-8">
          <h2 className="text-2xl font-light mb-4">8. Contribution License</h2>
          <p>
            By submitting Contributions, you grant us permission to access, store, process, and use any information and
            personal data you provide—including your settings and choices. You retain full ownership of your
            Contributions; however, you grant us a license to use, reproduce, display, and distribute your Contributions
            in connection with the Services.
          </p>
          <p className="mt-4">We are not liable for any statements or representations in your Contributions.</p>
        </section>

        <section id="services-management" className="mb-8">
          <h2 className="text-2xl font-light mb-4">9. Services Management</h2>
          <p>We reserve the right, but are not obligated, to:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Monitor the Services for violations of these Legal Terms;</li>
            <li>Take appropriate legal action against anyone who violates the law or these Legal Terms;</li>
            <li>
              Refuse, restrict access to, or disable any of your Contributions (to the extent technologically feasible);
            </li>
            <li>Remove or disable any files or content that are excessive in size or burdensome to our systems;</li>
            <li>
              Manage the Services in a manner designed to protect our rights and property and to facilitate proper
              functioning of the Services.
            </li>
          </ol>
        </section>

        <section id="privacy-policy" className="mb-8">
          <h2 className="text-2xl font-light mb-4">10. Privacy Policy</h2>
          <p>
            We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy
            (posted on the Services), which is incorporated herein.
          </p>
          <p className="mt-4">
            <strong>Note:</strong> The Services are hosted in the <strong>United States</strong>. If you access the
            Services from another region with different data protection laws, you are transferring your data to the
            United States and expressly consent to its transfer and processing.
          </p>
          <p className="mt-4">
            We do not knowingly collect personal information from children under 13. If we become aware that such
            information was collected without parental consent, we will delete it as soon as reasonably possible.
          </p>
        </section>

        <section id="term-and-termination" className="mb-8">
          <h2 className="text-2xl font-light mb-4">11. Term and Termination</h2>
          <p>
            These Legal Terms remain in effect while you use the Services. Without limiting any other provision, we
            reserve the right, at our sole discretion and without notice or liability, to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              Deny access to the Services (including blocking certain IP addresses) for any reason, including breach of
              these Legal Terms;
            </li>
            <li>
              Terminate your use or participation in the Services or delete any content you have posted, without
              warning.
            </li>
          </ul>
          <p className="mt-4">
            If your account is terminated or suspended for any reason, you are prohibited from registering a new account
            under your name, a fake or borrowed name, or on behalf of any third party.
          </p>
        </section>
        <section id="modifications-and-interruptions" className="mb-8">
          <h2 className="text-2xl font-light mb-4">12. Modifications and Interruptions</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Services at any time and for any
            reason without notice. We have no obligation to update any information on the Services and will not be
            liable for any modification, price change, suspension, or discontinuance of the Services.
          </p>
          <p className="mt-4">
            We cannot guarantee the Services will be available at all times. You agree that we have no liability for any
            loss, damage, or inconvenience caused by any downtime or discontinuance.
          </p>
        </section>

        <section id="governing-law" className="mb-8">
          <h2 className="text-2xl font-light mb-4">13. Governing Law</h2>
          <p>
            These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of
            the <strong>Commonwealth of Pennsylvania</strong>, without regard to its conflict of law principles.
          </p>
        </section>

        <section id="dispute-resolution" className="mb-8">
          <h2 className="text-2xl font-light mb-4">14. Dispute Resolution</h2>
          <h3 className="text-xl font-light mb-3">Informal Negotiations</h3>
          <p>
            To expedite resolution and control costs, the Parties agree to attempt to negotiate any dispute (“Dispute”)
            informally for at least <strong>thirty (30) days</strong> before initiating arbitration. Informal
            negotiations begin upon written notice from one Party to the other.
          </p>
          <h3 className="text-xl font-light mt-4 mb-3">Binding Arbitration</h3>
          <p>
            If informal negotiations fail to resolve a Dispute (except those Disputes excluded below), the Dispute will
            be resolved by binding arbitration under the Commercial Arbitration Rules of the American Arbitration
            Association ("AAA") and, where applicable, the AAA’s Supplementary Procedures for Consumer Related Disputes
            ("AAA Consumer Rules"). Arbitration fees and compensation will be governed by the AAA Consumer Rules. The
            arbitration may be conducted in person, by phone, or online, and the arbitrator’s decision will be in
            writing.
          </p>
          <p className="mt-4">
            If a Dispute proceeds in court instead of arbitration, it shall be brought in the state and federal courts
            located in the <strong>United States of America, Pennsylvania</strong>, and you waive any objections to
            jurisdiction or venue in such courts.
          </p>
          <h3 className="text-xl font-light mt-4 mb-3">Restrictions</h3>
          <p>
            Any arbitration shall be limited to the dispute between the Parties individually. No arbitration shall be
            joined with any other proceeding, nor will disputes be arbitrated on a class-action basis.
          </p>
          <h3 className="text-xl font-light mt-4 mb-3">Exceptions</h3>
          <p>The following disputes are excluded from the informal negotiation and binding arbitration provisions:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Disputes seeking to enforce or protect intellectual property rights;</li>
            <li>Disputes related to allegations of theft, piracy, invasion of privacy, or unauthorized use;</li>
            <li>Claims for injunctive relief.</li>
          </ul>
          <p className="mt-4">
            Any Dispute must be commenced within <strong>one (1) year</strong> of the cause of action arising. If any
            portion of this provision is found to be illegal or unenforceable, that portion will not apply, and the
            Dispute will be resolved in a court of competent jurisdiction.
          </p>
        </section>

        <section id="corrections" className="mb-8">
          <h2 className="text-2xl font-light mb-4">15. Corrections</h2>
          <p>
            There may be information on the Services containing typographical errors, inaccuracies, or omissions. We
            reserve the right to correct any such errors or update information at any time without prior notice.
          </p>
        </section>

        <section id="disclaimer" className="mb-8">
          <h2 className="text-2xl font-light mb-4">16. Disclaimer</h2>
          <p>
            <strong>THE SERVICES ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS.</strong> Your use of the Services
            is at your own risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied,
            including warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="mt-4">
            We make no representations regarding the accuracy or completeness of the Services’ content or any linked
            websites, and we are not liable for any errors or omissions.
          </p>
        </section>

        <section id="limitations-of-liability" className="mb-8">
          <h2 className="text-2xl font-light mb-4">17. Limitations of Liability</h2>
          <p>
            In no event will we or our directors, employees, or agents be liable for any direct, indirect, incidental,
            consequential, exemplary, special, or punitive damages (including lost profits, lost revenue, or loss of
            data) arising from your use of the Services—even if advised of the possibility of such damages.
          </p>
          <p className="mt-4">
            Notwithstanding anything to the contrary, our liability to you shall be limited to the lesser of the amount
            paid by you to us during the one (1) month period prior to the cause of action or{" "}
            <strong>$1,000.00 USD</strong>. Certain laws may not allow these limitations, so some or all may not apply.
          </p>
        </section>

        <section id="indemnification" className="mb-8">
          <h2 className="text-2xl font-light mb-4">18. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless us, including our subsidiaries, affiliates, officers,
            agents, partners, and employees, from any loss, damage, liability, claim, or demand (including reasonable
            attorneys’ fees) arising out of or relating to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your use of the Services;</li>
            <li>Your breach of these Legal Terms;</li>
            <li>Any breach of your representations and warranties;</li>
            <li>Your violation of third-party rights, including intellectual property rights;</li>
            <li>Any harmful act toward another user.</li>
          </ul>
          <p className="mt-4">
            We reserve the right, at your expense, to assume the exclusive defense and control of any matter subject to
            indemnification, and you agree to cooperate with our defense.
          </p>
        </section>

        <section id="user-data" className="mb-8">
          <h2 className="text-2xl font-light mb-4">19. User Data</h2>
          <p>
            We will maintain certain data that you transmit to the Services for performance and monitoring purposes.
            Although we perform regular backups, you are solely responsible for the data you transmit or that relates to
            your use of the Services. We have no liability for any loss or corruption of such data.
          </p>
        </section>

        <section id="electronic-communications" className="mb-8">
          <h2 className="text-2xl font-light mb-4">20. Electronic Communications, Transactions, and Signatures</h2>
          <p>
            Visiting the Services, sending emails, and completing online forms constitute electronic communications. You
            consent to receive such communications and agree that all agreements, notices, disclosures, and other
            communications provided electronically satisfy any legal requirement for a written document.
          </p>
          <p className="mt-4">
            You agree to the use of electronic signatures and electronic delivery of notices, policies, and records of
            transactions.
          </p>
        </section>

        <section id="sms-text-messaging" className="mb-8">
          <h2 className="text-2xl font-light mb-4">21. SMS Text Messaging</h2>
          <h3 className="text-xl font-light mb-3">Opting Out</h3>
          <p>
            If you wish to stop receiving SMS messages from us at any time, reply with <strong>"STOP"</strong>. You may
            receive a confirmation message.
          </p>
          <h3 className="text-xl font-light mt-4 mb-3">Message and Data Rates</h3>
          <p>
            Message and data rates may apply to SMS messages. These rates are determined by your carrier and your mobile
            plan.
          </p>
          <h3 className="text-xl font-light mt-4 mb-3">Support</h3>
          <p>
            If you have any questions regarding SMS communications, please email us at{" "}
            <a href="mailto:shui6234@gmail.com" className="text-blue-600 hover:underline">
              shui6234@gmail.com
            </a>{" "}
            or call <strong>7022923123</strong>.
          </p>
        </section>

        <section id="california-users" className="mb-8">
          <h2 className="text-2xl font-light mb-4">22. California Users and Residents</h2>
          <p>
            If any complaint is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the
            Division of Consumer Services of the California Department of Consumer Affairs in writing at:
          </p>
          <pre className="bg-gray-100 p-2 mt-2 mb-4">
            1625 North Market Blvd., Suite N112 Sacramento, California 95834
          </pre>
          <p>
            Or by telephone at <strong>(800) 952-5210</strong> or <strong>(916) 445-1254</strong>.
          </p>
        </section>

        <section id="miscellaneous" className="mb-8">
          <h2 className="text-2xl font-light mb-4">23. Miscellaneous</h2>
          <p>
            These Legal Terms, along with any policies or operating rules posted on the Services, constitute the entire
            agreement between you and us.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Our failure to enforce any right or provision shall not operate as a waiver.</li>
            <li>We may assign our rights and obligations to others at any time.</li>
            <li>We are not liable for any loss or delay caused by any cause beyond our control.</li>
            <li>
              If any provision is deemed unlawful or unenforceable, it is severable from the remaining provisions.
            </li>
            <li>No joint venture, partnership, employment, or agency relationship is created by these Legal Terms.</li>
            <li>You agree these Legal Terms will not be construed against us by reason of our having drafted them.</li>
          </ul>
        </section>

        <section id="contact-us" className="mb-8">
          <h2 className="text-2xl font-light mb-4">24. Contact Us</h2>
          <p>To resolve a complaint or to receive further information regarding the Services, please contact us at:</p>
          <p className="mt-4">
            <strong>Heliogram LLC</strong>
          </p>
          <p>
            <strong>Phone:</strong> 7022923123
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:shui6234@gmail.com" className="text-blue-600 hover:underline">
              shui6234@gmail.com
            </a>
          </p>
        </section>

        <div className="mt-8">
          <Link href="/" className="text-black hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  )
}

import Link from "next/link"

export default function PrivacyPolicy() {
  const tableOfContents = [
    { href: "#introduction", text: "Introduction" },
    { href: "#information-we-collect", text: "Information We Collect" },
    { href: "#how-we-use-information", text: "How We Use Your Information" },
    { href: "#information-sharing", text: "Information Sharing" },
    { href: "#your-choices", text: "Your Choices and Rights" },
    { href: "#data-retention", text: "Data Retention" },
    { href: "#data-security", text: "Data Security" },
    { href: "#cookies-and-tracking", text: "Cookies and Tracking Technologies" },
    { href: "#third-party-services", text: "Third-Party Services" },
    { href: "#childrens-privacy", text: "Children's Privacy" },
    { href: "#changes-to-privacy-policy", text: "Changes to This Privacy Policy" },
    { href: "#contact-us", text: "Contact Us" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 prose prose-gray dark:prose-invert max-w-4xl">
        <h1 className="text-3xl font-light mb-4">PRIVACY POLICY</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 24, 2025</p>

        <p className="mb-6">
          This Privacy Policy describes how <strong>Heliogram LLC</strong> (“we”, “us”, “our”) collect, use, share, and
          protect your information.
        </p>

        <div className="bg-gray-50 dark:bg-charcoal-light border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8">
          <p className="text-sm dark:text-gray-300">
            <strong>Note:</strong> Please review this Privacy Policy carefully. By using our Services, you consent to
            the practices described herein.
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

        <section id="introduction" className="mb-8">
          <h2 className="text-2xl font-light mb-4">1. Introduction</h2>
          <p>
            At Heliogram, we value your privacy and are committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site and
            use our Services.
          </p>
        </section>

        <section id="information-we-collect" className="mb-8">
          <h2 className="text-2xl font-light mb-4">2. Information We Collect</h2>
          <p>We may collect various types of information about you, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Personal Information:</strong> such as your name, email address, phone number, and other contact
              details when you register or communicate with us.
            </li>
            <li>
              <strong>Usage Information:</strong> details about your interactions with our Site and Services, including
              pages visited, time spent, and other analytical data.
            </li>
            <li>
              <strong>Device Information:</strong> information about the device you use, such as browser type, operating
              system, and IP address.
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> data collected through cookies and similar tracking
              mechanisms (see our Cookies section below).
            </li>
          </ul>
        </section>

        <section id="how-we-use-information" className="mb-8">
          <h2 className="text-2xl font-light mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Providing, operating, and maintaining our Services.</li>
            <li>Improving, personalizing, and expanding our Services.</li>
            <li>Understanding and analyzing how you use our Services.</li>
            <li>Developing new products, services, features, and functionality.</li>
            <li>Communicating with you for customer service, updates, and marketing purposes.</li>
            <li>Processing transactions and managing your orders.</li>
            <li>Detecting, preventing, and addressing technical and security issues.</li>
          </ul>
        </section>

        <section id="information-sharing" className="mb-8">
          <h2 className="text-2xl font-light mb-4">4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Service Providers:</strong> third-party vendors who assist us with payment processing, data
              analysis, email delivery, hosting, and customer support.
            </li>
            <li>
              <strong>Business Transfers:</strong> in connection with mergers, acquisitions, or asset sales.
            </li>
            <li>
              <strong>Legal Requirements:</strong> when required by law or in response to a valid legal request.
            </li>
            <li>
              <strong>With Your Consent:</strong> for any other purpose for which you have provided explicit consent.
            </li>
          </ul>
        </section>

        <section id="your-choices" className="mb-8">
          <h2 className="text-2xl font-light mb-4">5. Your Choices and Rights</h2>
          <p>You have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Accessing and updating your personal information by logging into your account.</li>
            <li>
              Opting out of receiving marketing communications by following the unsubscribe instructions in our emails.
            </li>
            <li>Requesting deletion of your personal information, subject to applicable legal obligations.</li>
          </ul>
          <p className="mt-4">
            Please note that some information may be retained as required by law or for legitimate business purposes.
          </p>
        </section>

        <section id="data-retention" className="mb-8">
          <h2 className="text-2xl font-light mb-4">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes for which it was
            collected, to comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section id="data-security" className="mb-8">
          <h2 className="text-2xl font-light mb-4">7. Data Security</h2>
          <p>
            We implement various security measures to protect your personal information. However, no method of
            transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee its
            absolute security.
          </p>
        </section>

        <section id="cookies-and-tracking" className="mb-8">
          <h2 className="text-2xl font-light mb-4">8. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to monitor activity on our Services, improve your
            experience, and gather usage data. You can adjust your browser settings to refuse cookies, though some parts
            of the Services may not function properly.
          </p>
        </section>

        <section id="third-party-services" className="mb-8">
          <h2 className="text-2xl font-light mb-4">9. Third-Party Services</h2>
          <p>
            Our Services may contain links to third-party websites or services that are not operated by us. This Privacy
            Policy does not apply to those sites. We encourage you to review the privacy policies of any third parties
            you visit.
          </p>
        </section>

        <section id="childrens-privacy" className="mb-8">
          <h2 className="text-2xl font-light mb-4">10. Children's Privacy</h2>
          <p>
            Our Services are not directed to children under the age of 13, and we do not knowingly collect personal
            information from children under 13. If we learn that we have collected information from a child under 13
            without parental consent, we will delete it as soon as possible.
          </p>
        </section>

        <section id="changes-to-privacy-policy" className="mb-8">
          <h2 className="text-2xl font-light mb-4">11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the “Last updated” date. We encourage you to review this Privacy
            Policy periodically.
          </p>
        </section>

        <section id="contact-us" className="mb-8">
          <h2 className="text-2xl font-light mb-4">12. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:</p>
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

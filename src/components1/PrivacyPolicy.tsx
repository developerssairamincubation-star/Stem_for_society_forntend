import React from "react";
import { Reveal } from "@/sfs/components/ui/Reveal";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";

const PrivacyPolicy: React.FC = () => {
  

  return (
    <PageFrame>
      <PageHero title="Privacy Policy" description="STEM for Society | Effective Date: January 2026" />

      <section className="section" aria-label="Privacy Policy">
        <div className="container-x">
          <div className="mx-auto max-w-3xl leading-relaxed">

        {/* Intro */}
        <p className="t-lead mb-10 text-ink/80">
          STEM for Society ("we", "us", or "our") is committed to protecting the
          privacy and personal data of all users, including students and their
          parents or guardians. This Privacy Policy explains what information we
          collect, how we use it, and your rights as a data subject.
        </p>

        {/* Section Component */}
        {[
          {
            title: "1. Information We Collect",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><b>Identity Information:</b> Full name, date of birth, class/grade</li>
                <li><b>Contact Information:</b> Email, phone number, city/state</li>
                <li><b>Educational Details:</b> School name, board, academic year</li>
                <li><b>Payment Information:</b> Transaction ID (no card data stored)</li>
                <li><b>Usage Data:</b> Attendance, activity, quiz responses</li>
                <li><b>Communications:</b> Feedback, support queries</li>
                <li><b>Device Data:</b> IP address, browser, cookies</li>
              </ul>
            ),
          },
          {
            title: "2. Purpose of Data Use",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing registrations and enrolment</li>
                <li>Delivering materials and certificates</li>
                <li>Communicating updates and schedules</li>
                <li>Improving user experience</li>
                <li>Issuing certificates and badges</li>
                <li>Handling support queries</li>
                <li>Conducting anonymised research</li>
              </ul>
            ),
          },
          {
            title: "3. Consent for Minors",
            content: (
              <p>
                We require parental or guardian consent before collecting data
                from users under 18. Parents may request access, correction, or
                deletion of their child's data.
              </p>
            ),
          },
          {
            title: "4. Data Storage & Protection",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Data stored securely on servers in India</li>
                <li>Protected using encryption (TLS/SSL)</li>
                <li>Access restricted to authorized personnel</li>
                <li>Regular security audits and backups</li>
                <li>Data retained only as necessary</li>
              </ul>
            ),
          },
          {
            title: "5. Third-Party Sharing Policy",
            content: (
              <>
                <p className="mb-2">
                  We do not sell or trade your data. Limited sharing includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment Gateways (Razorpay, Instamojo)</li>
                  <li>Communication Tools (Email, WhatsApp)</li>
                  <li>Certificate Platforms</li>
                  <li>Analytics Tools (Google Analytics - anonymised)</li>
                </ul>
              </>
            ),
          },
          {
            title: "6. Cookies Policy",
            content: (
              <p>
                We use essential, analytics, and preference cookies to improve
                your experience. You can disable cookies in browser settings.
              </p>
            ),
          },
          {
            title: "7. Communication Consent",
            content: (
              <p>
                By registering, you agree to receive program-related
                communication via email, SMS, and WhatsApp.
              </p>
            ),
          },
          {
            title: "8. Your Rights",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your data</li>
                <li>Request correction</li>
                <li>Request deletion</li>
                <li>Object to processing</li>
                <li>Request data portability</li>
              </ul>
            ),
          },
          {
            title: "9. Policy Updates",
            content: (
              <p>
                This policy may be updated periodically. Changes will be
                communicated via email or website notice.
              </p>
            ),
          },
          {
            title: "10. Contact Information",
            content: (
              <p>
                Email: info@stemforsociety.org <br />
                Website: www.stemforsociety.org/privacy-policy
              </p>
            ),
          },
        ].map((section, index) => (
          <Reveal as="section" key={index} className="border-t border-tint py-8">
            <h2 className="t-heading mb-3">{section.title}</h2>
            <div className="t-body text-ink/75 [&_li+li]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">{section.content}</div>
          </Reveal>
        ))}

        {/* Footer */}
        <div className="border-t border-tint pt-8 text-center">
          <p className="t-body font-medium">
            STEM for Society is committed to handling your data responsibly and transparently.
          </p>
        </div>

          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default PrivacyPolicy;

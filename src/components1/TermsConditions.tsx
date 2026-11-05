import React from "react";
import { Reveal } from "@/sfs/components/ui/Reveal";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";

const TermsConditions: React.FC = () => {
  return (
    <PageFrame>
      <PageHero title="Terms & Conditions" description="STEM for Society | Effective Date: January 2026" />

      <section className="section" aria-label="Terms & Conditions">
        <div className="container-x">
          <div className="mx-auto max-w-3xl leading-relaxed">

        {/* Sections */}
        {[
          {
            title: "1. Acceptance of Terms",
            content: (
              <p>
                By using STEM for Society services, you agree to these Terms.
                If enrolling for a minor, you confirm you are the parent/guardian
                and accept these terms on their behalf.
              </p>
            ),
          },
          {
            title: "2. Eligibility",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Open to Class 6–12 students, college students, and early career learners</li>
                <li>Users under 18 require parental consent</li>
                <li>STEM may verify eligibility and reject registrations</li>
              </ul>
            ),
          },
          {
            title: "3. Services Offered",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Summer schools and short-term programs</li>
                <li>Career awareness and life skills workshops</li>
                <li>Networking and mentorship sessions</li>
                <li>Certification programs</li>
                <li>Career bootcamps and skill cohorts</li>
              </ul>
            ),
          },
          {
            title: "4. User Responsibilities",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information</li>
                <li>Attend sessions and behave respectfully</li>
                <li>Do not share login credentials or materials</li>
                <li>Maintain proper internet connectivity</li>
              </ul>
            ),
          },
          {
            title: "5. Intellectual Property Rights",
            content: (
              <p>
                All content belongs to STEM for Society. You may not reproduce
                or distribute it without permission. Personal notes and
                assignments remain your property.
              </p>
            ),
          },
          {
            title: "6. Payments & Pricing",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>All fees are in INR</li>
                <li>Full payment required before program start</li>
                <li>Pricing may change for future batches</li>
                <li>Fees are non-transferable</li>
              </ul>
            ),
          },
          {
            title: "7. Certification Disclaimer",
            content: (
              <>
                <p className="mb-2">
                  Certificates are for participation and skill development only.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Not equivalent to academic degrees</li>
                  <li>Requires attendance and participation</li>
                  <li>No guarantee of job or admission outcomes</li>
                </ul>
              </>
            ),
          },
          {
            title: "8. Code of Conduct",
            content: (
              <>
                <ul className="list-disc pl-6 space-y-2">
                  <li>No abusive or disrespectful behavior</li>
                  <li>No plagiarism or dishonesty</li>
                  <li>No unauthorized sharing of content</li>
                  <li>No harassment or discrimination</li>
                </ul>
                <p className="mt-2">
                  Violations may result in removal without refund.
                </p>
              </>
            ),
          },
          {
            title: "9. Platform Usage Restrictions",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>For personal, non-commercial use only</li>
                <li>No scraping or downloading content</li>
                <li>No attempts to disrupt platform security</li>
              </ul>
            ),
          },
          {
            title: "10. Limitation of Liability",
            content: (
              <p>
                STEM is not liable for indirect losses. Maximum liability is
                limited to the fee paid.
              </p>
            ),
          },
          {
            title: "11. Cancellation Policy Reference",
            content: (
              <p>
                Refunds and cancellations follow the Refund Policy published
                separately.
              </p>
            ),
          },
          {
            title: "12. Policy Updates",
            content: (
              <p>
                Terms may be updated periodically. Continued use means
                acceptance of updated terms.
              </p>
            ),
          },
          {
            title: "13. Governing Law",
            content: (
              <p>
                Governed by the laws of India. Jurisdiction: Chennai, Tamil Nadu.
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
            Questions? Contact: info@stemforsociety.org
          </p>
        </div>

          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default TermsConditions;

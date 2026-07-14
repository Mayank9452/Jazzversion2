import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { BottomNavBar } from "./BottomNavBar";
import { useTheme } from "next-themes";

const DarkModeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Hexagon Pattern Grid on the Right */}
    <div className="absolute right-0 top-1/4 w-80 h-96 opacity-5 text-brand-yellow-100">
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
        <pattern id="hex-dark" width="10" height="17.32" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M 10 0 L 5 2.89 L 0 0 L 0 5.77 L 5 8.66 L 10 5.77 Z M 0 8.66 L 5 11.55 L 0 14.43 L 0 20.21 L 5 23.09 L 10 20.21 L 10 14.43 L 5 11.55 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
        </pattern>
        <rect width="100" height="100" fill="url(#hex-dark)" />
      </svg>
    </div>

    {/* Circuit lines on the left */}
    <svg className="absolute left-0 top-10 w-64 h-96 text-brand-yellow-100/5" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.6">
      <path d="M 0,20 L 30,20 L 50,40 L 50,70 L 60,80 L 100,80" />
      <path d="M 0,50 L 20,50 L 35,65 L 35,100 L 45,110 L 100,110" />
      <circle cx="50" cy="40" r="1.2" fill="currentColor" />
      <circle cx="60" cy="80" r="1.2" fill="currentColor" />
      <circle cx="35" cy="65" r="1.2" fill="currentColor" />
      <circle cx="45" cy="110" r="1.2" fill="currentColor" />
    </svg>
  </div>
);

const LightModeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* Geometric Wireframe Sphere on the Left */}
    <svg className="absolute -left-10 top-1/4 w-80 h-96 text-black-v4/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
      <polygon points="50,10 70,30 50,50 30,30" />
      <polygon points="50,50 70,70 50,90 30,70" />
      <polygon points="70,30 90,50 70,70 50,50" />
      <polygon points="30,30 50,50 30,70 10,50" />
      <line x1="50" y1="10" x2="50" y2="50" />
      <line x1="50" y1="50" x2="50" y2="90" />
      <line x1="30" y1="30" x2="70" y2="70" />
      <line x1="70" y1="30" x2="30" y2="70" />
    </svg>

    {/* Thin Circuit lines on the right */}
    <svg className="absolute right-0 top-12 w-64 h-96 text-black-v4/30" viewBox="0 0 100 150" fill="none" stroke="currentColor" strokeWidth="0.5">
      <path d="M 100,30 L 70,30 L 55,45 L 55,80 L 40,95 L 0,95" />
      <path d="M 100,60 L 80,60 L 65,75 L 65,110 L 50,125 L 0,125" />
      <circle cx="55" cy="45" r="0.8" fill="currentColor" />
      <circle cx="40" cy="95" r="0.8" fill="currentColor" />
      <circle cx="65" cy="75" r="0.8" fill="currentColor" />
      <circle cx="50" cy="125" r="0.8" fill="currentColor" />
    </svg>
  </div>
);

export default function PrivacyPolicyPageNew() {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <div className="relative bg-background text-foreground overflow-hidden transition-colors duration-300 min-h-[calc(100vh-95px)] pb-10">
        {isDark ? <DarkModeBackground /> : <LightModeBackground />}
        {/* Ambient top gradient glow */}
        <div
          className="pointer-events-none fixed inset-x-0 top-0 h-80 z-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,202,32,0.15) 0%, transparent 70%)"
              : "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(223,162,8,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Custom Navigation Header */}
        <div className="flex items-center justify-between px-4 py-4 relative z-10 border-b border-border bg-white/50 dark:bg-card/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-white/40 dark:bg-card/40 hover:bg-brand-gradient hover:text-brand-black-100 transition-colors text-foreground shadow-sm"
              title="Back"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <span className="text-base font-black tracking-wider uppercase text-foreground">Privacy Policy</span>
          </div>
        </div>

        <div className="pt-6 px-4 max-w-md mx-auto relative z-10">
          {/* Scrollable Privacy Content Card */}
          <div className="rounded-3xl bg-white dark:bg-card/45 backdrop-blur-md border border-border p-5 shadow-lg overflow-y-auto relative text-[12px] leading-relaxed text-brand-gray-400 dark:text-white/90">
            <div className="space-y-5">
              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  1. GENERAL
                </h5>
                <p className="mb-2">
                  <strong>1.1</strong> Advantagex Digital Pte Ltd. (<strong>“GPL”, “We”, “Our”, “Us”</strong>) is committed to the protection of
                  personal information provided by the users (<strong>“You”, “Your”, “User”</strong>) to GPL. You agree that
                  Your use of GPL mobile application (“App”) implies Your consent to the collection, retention
                  and use of Your personal information in accordance with the terms of this Privacy Policy
                  (“Privacy Policy”).
                </p>
                <p className="mb-2">
                  <strong>1.2</strong> This Privacy Policy is an electronic record in the form of an electronic contract formed
                  under the information Technology Act, 2000 and the rules made thereunder and the
                  amended provisions pertaining to electronic documents / records in various statutes as
                  amended by the information Technology Act, 2000. This Privacy Policy does not require any
                  physical, electronic or digital signature and is a legally binding document between you and
                  GPL.
                </p>
                <p className="mb-2">
                  <strong>1.3</strong> We take the privacy of our users seriously. We are committed to safeguarding the
                  privacy of our users while providing a personalized and valuable service.
                </p>
                <p className="mb-2">
                  <strong>1.4</strong> No User information is rented or sold to any third party. When you use the Portal / App,
                  it may collect your device number and other personal information. A high standard of
                  security is maintained by us for our users. However, the transmission of information via the
                  Internet or telephone networks is not completely secure. While we do our best to protect
                  your information, particularly with respect to protection of your personal data, GPL cannot
                  ensure the security of Your data transmitted via the internet, telephone or any other
                  networks.
                </p>
                <p className="mb-2">
                  <strong>1.5</strong> Access to the contents available through the Portal / App is conditional upon Your
                  approval of this Privacy Policy which should be read together with the terms and conditions
                  of use (“Terms”). You acknowledge that this Privacy Policy, together with our Terms, forms
                  Our agreement with You in relation to your use of the product (“Agreement”).
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  2. INFORMATION COLLECTED
                </h5>
                <p className="font-bold text-brand-gold-100 dark:text-white mb-1">
                  2.1 Traffic Data Collected
                </p>
                <p className="mb-2">
                  In order to provide the App, We automatically track and collect the following categories of
                  information when You use the App:
                </p>
                <ul className="list-disc pl-4 space-y-1 mb-3">
                  <li>IP addresses;</li>
                  <li>Domain servers; and</li>
                  <li>Other information with respect to your device, interaction of your device with the Portal and applications (collectively “Traffic Data”).</li>
                </ul>

                <p className="font-bold text-brand-gold-100 dark:text-white mb-1">
                  2.2 Personal Information Collected
                </p>
                <p className="mb-2">
                  In order to provide the product, We may require you to provide us with certain information
                  that personally identifies You (“Personal Information“). Personal Information includes the
                  following categories of information:
                </p>
                <ul className="list-disc pl-4 space-y-1 mb-3">
                  <li>Contact data (such as your email address, phone number and any details of your contacts);</li>
                  <li>Demographic data (such as your time zone, your postal address and location details); and If you communicate with us by, for example, e-mail or letter, any information provided in such communication may be collected by GPL;</li>
                  <li>Financial data (such as your account details, e-wallet details, credit or debit card details etc. that you have provided us for disbursement of prizes and coupons).</li>
                </ul>

                <p className="mb-2">
                  <strong>2.3</strong> Our product may transmit your personal information to our internal servers. This
                  personal information is immediately deleted once you delete the account, except to the
                  extent it is necessary to store the same under applicable laws. Further, we have
                  implemented commercially reasonable physical, managerial, operational and technical
                  security measures to protect the loss, misuse and alteration and to preserve the security of
                  the personal information in our care. Finally, this information is used strictly in line with our
                  business purposes and to provide you with useful features.
                </p>

                <p className="mb-2">
                  <strong>2.4</strong> Our product may contain links to third party websites or applications. You agree and
                  understand that privacy policies of these websites are not under our control. You
                  understand that once you leave our servers, use of any information you provide shall be
                  governed by the privacy policy of the operator of the site used by you.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  3. DISCLOSURE OF PERSONAL INFORMATION
                </h5>
                <p className="mb-2">
                  <strong>3.1</strong> We do not disclose Your Personal Information to any third parties other than to GPL’s
                  affiliates or other trusted business or persons, based on strict adherence and in compliance
                  with Our Privacy Policy and any other appropriate confidentiality and security measures.
                </p>
                <p className="mb-2">
                  <strong>3.2</strong> We use our best efforts to use information in aggregate form (so that no individual user
                  is identified) for the following purposes:
                </p>
                <ul className="list-disc pl-4 space-y-1 mb-3">
                  <li>To build up marketing profiles;</li>
                  <li>To aid strategic development, data collection and business analytics;</li>
                  <li>To provide seamless and swift delivery of prizes and coupons to You;</li>
                  <li>To manage Our relationship with advertisers and partners;</li>
                  <li>To audit usage of the product; and</li>
                  <li>To enhance User experience in relation to the product (collectively, <strong>“Permitted Use”</strong>).</li>
                </ul>
                <p className="mb-2">
                  <strong>3.3</strong> We reserve the right to disclose personal information if required to do so by law or if we
                  believe that it is necessary to do so to protect and defend the rights, property or personal
                  safety of GPL, the product, or our users.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  4. CONFIDENTIALITY
                </h5>
                <p className="mb-2">
                  <strong>4.1</strong> Except as otherwise provided in this privacy policy, We will keep your personal
                  information private and will not share it with third parties, unless We believe in good faith
                  that disclosure of your personal information or any other information We collect about you
                  is necessary for permitted Use or to:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Comply with a court order or other legal process;</li>
                  <li>Protect the rights, property or safety of GPL or another party;</li>
                  <li>Enforce the Agreement, including Terms; or</li>
                  <li>Respond to claims that any posting or other content violates the rights of third-parties.</li>
                </ul>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  5. SECURITY
                </h5>
                <p className="mb-2">
                  <strong>5.1</strong> The security of your personal information is important to Us. We follow generally
                  accepted industry standards to protect the personal information submitted to Us, both
                  during transmission and once We receive it. All information gathered on our website is
                  securely stored within our controlled database. The database is stored on servers secured
                  behind a firewall; access to the servers is password-protected and is strictly limited.
                </p>
                <p className="mb-2">
                  <strong>5.2</strong> Although we make best possible efforts to store Personal Information in a secure
                  operating environment that is not open to the public, you should understand that there is
                  no such thing as complete security, and we do not guarantee that there will be no
                  unintended disclosures of your personal information. If we become aware that your
                  personal information has been disclosed in a manner not in accordance with this privacy
                  policy, we will use reasonable efforts to notify you of the nature and extent of such
                  disclosure as soon as reasonably possible and as permitted by law.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  6. COOKIES
                </h5>
                <p className="mb-2">
                  <strong>6.1</strong> To improve the responsiveness of the sites for Our Users, We may use “cookies”, or
                  similar electronic tools to collect information to assign each visitor a unique, random
                  number as a user identification (User ID) to understand the user’s individual interests using
                  the Identified Computer. Unless you voluntarily identify yourself (through registration, for
                  example), We will have no way of knowing who you are, even if we assign a cookie to your
                  computer or smartphone. The only personal information a cookie can contain is information
                  you supply.
                </p>
                <p className="mb-2">
                  <strong>6.2</strong> Our web servers automatically collect limited information about Your computer’s
                  connection to the Internet, including Your IP address, when You visit Our site. Your IP
                  address does not identify You personally. We use this information to deliver Our web pages to
                  You upon request, to tailor Our site to the interests of Our Users, to measure traffic within Our
                  site and let advertisers know the geographic locations from where Our visitors come.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  7. UPDATES AND CHANGES TO PRIVACY POLICY
                </h5>
                <p className="mb-2">
                  <strong>7.1</strong> We reserve the right, at any time, to add to, change, update, or modify this Privacy Policy
                  so please review it frequently. If we do, then We will post these changes on this page.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  8. YOUR RIGHTS
                </h5>
                <p className="mb-2">
                  <strong>8.1</strong> You have a right to correct any errors in your personal information available with Us. You
                  may request us in writing that we cease to use your personal information.
                </p>
              </div>

              <div>
                <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mb-2">
                  9. RESTRICTION OF LIABILITY
                </h5>
                <p className="mb-2">
                  <strong>9.1</strong> GPL makes no claims, promises or guarantees about the accuracy, completeness, or
                  adequacy of the contents available through the product and expressly disclaims liability for
                  errors and omissions in the contents available through the portal / app.
                </p>
                <p className="mb-2">
                  <strong>9.2</strong> No warranty of any kind, implied, expressed or statutory, including but not limited to the
                  warranties of non-infringement of third party rights, title, merchantability, fitness for a
                  particular purpose and freedom from computer virus, is given with respect to the contents
                  available through the product or its links to other internet resources as may be available to
                  you through the App.
                </p>
                <p className="mb-2">
                  <strong>9.3</strong> Reference in the App to any specific commercial products, processes, or services, or the
                  use of any trade, firm or corporation name is for the information and convenience of the
                  public, and does not constitute endorsement, recommendation, or favoring by GPL.
                  If you have questions or concerns, feel free to email us or to correspond
                  at <a href="mailto:techsupport@adxdigitalsg.com" className="text-brand-yellow-100 hover:underline">techsupport@adxdigitalsg.com</a> and we will attempt to address your concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}

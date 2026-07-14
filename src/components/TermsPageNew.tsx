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

export default function TermsPageNew() {
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
            <span className="text-base font-black tracking-wider uppercase text-foreground">Terms of Use</span>
          </div>
        </div>

        <div className="pt-6 px-4 max-w-md mx-auto relative z-10">
          {/* Scrollable Terms Content Card */}
          <div className="rounded-3xl bg-white dark:bg-card/45 backdrop-blur-md border border-border p-5 shadow-lg overflow-y-auto relative text-[12px] leading-relaxed text-brand-gray-400 dark:text-white/90">
            <div className="space-y-4">
              <p className="text-center font-bold text-brand-gold-100 dark:text-white">
                AdvantageX Digital Pte Ltd. - Gamebox Premier League (GPL)
                <span className="block mt-1 text-xs text-brand-yellow-100 uppercase">Terms of Use</span>
              </p>

              <p>
                Hola, Salam! and very warm welcome to the Terms of Use ("Terms") of AdvantageX Digital Pte Ltd., a firm incorporated, with its registered office at 30 CECIL STREET, #19-08 PRUDENTIAL TOWER, SINGAPORE (049712) ("Gamebox Premier League", "GPL", "We", "Us", or "Our"). GPL provides HTML5 games based live tournaments. These games are either created by GPL or independent developers who sell/license their HTML5 games to GPL. These games run online within a browser and do not have to be downloaded or installed.
              </p>

              <p>
                By accessing or using the Platform (defined below) you agree to be bound by these Terms. Your agreement with us includes these Terms, (collectively "Agreement").
              </p>

              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-[11px] text-red-700 dark:text-red-400 font-bold">
                IF YOU DO NOT AGREE WITH THESE TERMS, THEN PLEASE REFRAIN FROM USING THE PLATFORM. BY ACCESSING OR USING THE PLATFORM, YOU IRREVOCABLY ACCEPT THE AGREEMENT AND AGREE TO ABIDE BY THE SAME (AS UPDATED FROM TIME TO TIME).
              </div>

              <p>
                If you have downloaded Our PWA / App from Google Play Store, You will also be subject to Google Play Terms of Service. If there is any conflict between Google Play Terms of Service and this Agreement with respect to your use of the App, then, this Agreement shall prevail.
              </p>

              <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mt-6">
                Definitions
              </h5>

              <ul className="space-y-2.5 list-none pl-0">
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Subscription"</strong> is an access model of the product where subscribers get access to the portal and tournaments hosted on the portal in which users compete to score in the Games hosted by GPL. The access depends on the subscription rules where entry fee and no of days of access is defined and is chosen by subscriber (if paid the subscription fee) or defined by GPL if ‘Free to play’ access. Generally subscription will require the user to pay an entry fee to subscribe. Free to play shall be as per the definition of GPL.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Tournament"</strong> is an event in which users compete to score in the Games hosted by GPL on their Platform. Tournament can be either ‘Paid’ or ‘Free to play’. Paid Tournaments will require the Player to pay an entry fee to participate. Free to play shall be open to all Players.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Player"</strong> is a subscriber (defined below) who meets the eligibility criteria as detailed in Clause 4.1 (below) and participates in Tournaments that are hosted by GPL on their Platform.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Subscriber"</strong> is a User (defined below) who has paid a subscription fee as defined for the geo and has the access to the GPLs content.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Currencies"</strong> means the Deposits OR MY PLAY COINS, Winnings OR REWARD COINS OR ANY ADHOC GIVE AWAY (collectively).
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Deposits" or "Deposit Balance" or "My Play Coins"</strong> is the amount added by the Player to his/her Account through his/her subscription fee payment through their mobile operator or their e-wallet or any other account.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Games"</strong> shall mean the HTML5 games that are licensed / owned / developed by GPL and made available to Users on the Platform.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Personal Information"</strong> means any information that relates to a natural person, which, either directly or indirectly, in combination with other information available or likely to be available with a body corporate, is capable of identifying such person.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Platform"</strong> means the website available at http://gpl.gamebox.pk and any sub domains or igpl.pro and any sub domains ("Website") and the GPL mobile application on Android ("Application").
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Winnings"</strong> is an award coin that may be given to a Player at GPL’s sole discretion.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Reward Coin" or "Winning Balance"</strong> is an award given to a Player for being a top scorer in a particular Tournament.
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Territory"</strong> shall mean <strong>Pakistan.</strong>
                </li>
                <li>
                  <strong className="text-brand-gold-100 dark:text-brand-yellow-100">"Billing Provider"</strong> shall mean <strong>Telenor.</strong>
                </li>
              </ul>

              <h5 className="font-extrabold text-brand-gold-100 dark:text-brand-yellow-300 uppercase tracking-wider text-[13px] border-b border-border pb-1 mt-6">
                Terms & Conditions Detail
              </h5>

              <ol className="space-y-4 list-decimal pl-4">
                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Parties to the Agreement</strong>
                  These Terms describe a contractual agreement between You, the User of the Platform, and GPL regarding Your use of the Platform. GPL has the right to refuse access in its discretion for any or no reason. Without limiting the foregoing, You specifically acknowledge that GPL reserves the right to terminate or limit Your access in the event that GPL determines, in its sole discretion, that You have violated the policies of GPL or any forum used by You, including the activities that adversely affect the experience of other Users.
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Eligibility Criteria for User(s)</strong>
                  <ol className="list-disc pl-4 space-y-1">
                    <li>You must be of legal age as applicable in local law or at least 13 years of age to access and use the GPL Platform. If You are between the age of 13 to 17 years, Your access to the Platform should be permitted by Your parent or legal guardian;</li>
                    <li>You (or Your parent/guardian) must agree to be bound by these Terms;</li>
                    <li>You must be a resident of the country the billing provider you have used to enter is operating in.</li>
                  </ol>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">General Disclaimers</strong>
                  <ol className="list-disc pl-4 space-y-2">
                    <li>By use of the Platform, You agree that You meet with the Eligibility Criteria as detailed in Clause 2 (above) and that You are fully able and competent to understand and accept this Agreement as a binding contract and to abide by all Terms.</li>
                    <li>You shall not access the Platform by any other means other than through the interfaces that are provided by GPL and not acquire, copy, or monitor any portion of the Platform in any way to reproduce or circumvent the navigational structure or presentation of the Platform, to obtain or attempt to obtain any materials, documents, or information through any means not specifically made available through the Platform.</li>
                    <li>
                      You shall not host, display, upload, modify, publish, or share any information on the Platform that:
                      <ul className="list-square pl-4 mt-1 space-y-1 text-muted-foreground">
                        <li>Belongs to another person to which You do not have any right to; or</li>
                        <li>Is grossly harmful, blasphemous, defamatory, obscene, pornographic, pedophilic, libelous, invasive of another’s privacy, hateful, racially objectionable, disparaging, relating to encouraging money laundering or gambling or otherwise unlawful in any manner; or</li>
                        <li>Engages in any activity that interferes with or disrupts access to the Platform or GPL servers / networks; or</li>
                        <li>Falsifies or deletes any author attributions, legal or other notices, proprietary designations, labels of the origin or source of software, or other material on the Platform.</li>
                      </ul>
                    </li>
                    <li>GPL shall not be liable for any misuse of the Personal Information shared by You with Us or a third party on Your profile on the Platform, chat rooms, forums, or game comments.</li>
                    <li>GPL reserves the right to change these Terms from time to time, and such changes will become applicable to You if You continue to use the Platform at any time after such changes are posted on the Platform. We recommend that you visit this page periodically to be sure You are aware of the most recent Terms.</li>
                    <li>If You do not agree to these Terms, do not use any of the Platform.</li>
                  </ol>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Tournaments Terms and Conditions</strong>
                  <p className="mb-2">
                    The following terms and conditions govern the Player’s participation in the Tournaments hosted by GPL on its Platform. Each Tournament may have its own set of rules ("Rules") and in the event of any conflict between these Terms and the Rules of the relevant Tournament; the Rules shall supersede the Terms.
                  </p>
                  <ol className="list-disc pl-4 space-y-3">
                    <li>
                      <strong>Eligibility Criteria (Players):</strong>
                      <ul className="list-circle pl-4 space-y-1">
                        <li>You should be an individual; resident of the country the billing provider is operating in.</li>
                        <li>You should be of an age of 18 years or above at the time of entry into the Tournament; You need to be a subscriber / user of our billing provider;</li>
                        <li>You are not restricted by limited capacity;</li>
                        <li>You are not a compulsive player;</li>
                        <li>You are not depositing money originating from crime and/or unauthorized activities into Your Account; and</li>
                        <li>You are not using Your Account to conduct any criminal/illegal activities.</li>
                      </ul>
                      <strong className="block mt-2 text-red-600 dark:text-red-400">
                        GPL employees and their immediate family members (spouses, domestic partners, parents, grandparents, siblings, children, and grandchildren) are not eligible to participate in Tournaments.
                      </strong>
                    </li>

                    <li>
                      <strong>Player Account:</strong>
                      <ul className="list-circle pl-4 space-y-1">
                        <li>To participate in a Tournament You must provide Your mobile phone number registered with our billing partner. The mobile phone number shared by You, will be verified by GPL using mobile technology or else an One Time Password ("OTP") system. Upon You, successfully verifying the OTP, an account will be created for You ("Account").</li>
                        <li>By registering for an Account, You represent, warrant and agree that You meet with the eligibility criteria, use Your actual identity, and provide only true, accurate, and complete information.</li>
                      </ul>
                    </li>

                    <li>
                      <strong>Tournament Disclaimers:</strong>
                      <p className="font-bold text-brand-gold-100 dark:text-brand-yellow-100 mt-1">
                        THE USER MUST MEET WITH THE ELIGIBILITY CRITERIA AS DETAILED IN CLAUSE 4.1. THE GAMES ARE BASED ON SKILL AND NOT CHANCE. ANY AMOUNT RECEIVED BY GPL AS AGAINST THE PLAYER DEPOSIT SHALL BE NON-REFUNDABLE.
                      </p>
                    </li>

                    <li>
                      <strong>Player - Deposits, Tokens and Winnings:</strong>
                      <ul className="list-circle pl-4 space-y-1">
                        <li><strong>Purchase:</strong> Players may purchase PLAY COINS through their billing account. Any Deposit to the Account of a Player is non-refundable.</li>
                        <li><strong>Entry Fee:</strong> The PLAY COINS and REWARD COINS may be used as entry fee for the paid Tournaments.</li>
                        <li><strong>Awards:</strong> Awards for all Tournaments shall be declared in the Rules of such Tournament. All awards are either in the form of PLAY COINS or REWARD COINS or ANY ADHOC GIVE AWAY.</li>
                        <li><strong>Redemption:</strong> Only REWARD COINS alone may be redeemed by the Player from his/ her GPL Account to his/ her respective linked billing provider account.</li>
                      </ul>
                    </li>
                  </ol>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Limitations on Players</strong>
                  <p>
                    Player undertakes to always follow the applicable gaming rules for all Games that are listed as part of the tournaments. Any breach of the gaming rules or the Terms will automatically mean that the Players entry to the tournaments is declared void and the Player will forfeit their entitlement to any winnings.
                  </p>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">No Representations of Warranties</strong>
                  <p>
                    The Platform is provided "as is", GPL expressly disclaims all express or implied representations or warranties.
                  </p>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Limitation of Liability</strong>
                  <p>
                    In no event shall GPL be liable for any direct or indirect damage, including but not limited to, delay, damages caused by unused opportunity of the Platform, loss of profits, goodwill, or other financial loss.
                  </p>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Intellectual Property Rights</strong>
                  <p>
                    All reproduction or distribution of any material on the Platform, including but not limited to text, photographs, movies, music and software programs is strictly prohibited, unless explicitly stated otherwise.
                  </p>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Applicable Law and Jurisdiction</strong>
                  <p>
                    These Terms shall be governed by the laws of territory. Any claim or dispute between the Player and GPL will be entertained and tried solely and exclusively by a court of competent jurisdiction located in New Delhi, India.
                  </p>
                </li>

                <li>
                  <strong className="text-brand-gold-100 dark:text-white block mb-1">Games of Skill</strong>
                  <p>
                    A "Game of Skill" is a game where the outcome is determined mainly by mental or physical skill rather than by chance. GPL does not support, endorse or offer to Users ‘games of chance’ for money.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}

type SectionLabelProps = {
    text: string;
    anotherText?: string;
    bgColor?: string
};

const SectionLabel: React.FC<SectionLabelProps> = ({ text, anotherText, bgColor }) => (
    <div className="section-label-wrapper mt-2">
        <div className="popular-games-heading text-center">
            <h5 className="heading-text">{text}</h5>
            {anotherText && (<p className="subheading-text">{anotherText}</p>)}
        </div>

        <style>
            {`
        .section-label-wrapper {
            width: 100%;
          display: inline-block;
          padding: 3px; /* space for the animated border */
          border-radius: 8px;
          // background: linear-gradient(270deg, #ff00cc, #3333ff, #00ffcc, #ff00cc);
          background-size: 600% 600%;
          animation: borderMove 6s ease infinite;
          margin: 0 auto 12px auto;
        }

        .popular-games-heading {
    
          padding: 10px 20px 5px 20px;
          border-radius: 6px;
          position: relative;
        }

        .popular-games-heading::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white; /* matches inner box background */
        }

        .heading-text {
          font-weight: bold;
          font-size: 1rem;
          animation: scaleUpDown 1.8s ease-in-out infinite;
          background: linear-gradient(270deg, #ff00cc, #3333ff, #00ffcc, #ff00cc);
          background-size: 600% 600%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: black; /* fallback */
        }

        .subheading-text {
      font-size: 13px;
      margin-top: 4px;
      animation: scaleUpDownSubtle 2.2s ease-in-out infinite;
      background: linear-gradient(270deg, #43ff82, #ff5c33, #14a0d7, #ff00cc);
      background-size: 600% 600%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
      color: #1e100f;
    }

        @keyframes scaleUpDown {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes scaleUpDownSubtle {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.04);
      }
    }

        @keyframes borderMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}
        </style>
    </div>
);

export default SectionLabel;

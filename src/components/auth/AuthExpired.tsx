import svgPaths from "../../imports/svg-v92ahxecnf";
import { AuthFooter } from './AuthFooter';

interface AuthExpiredProps {
  onBackToLogin: () => void;
  onClose?: () => void;
}

function ClockCountdown() {
  return (
    <div className="relative shrink-0 size-[128.363px]" data-name="ClockCountdown">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 129 129">
        <g id="ClockCountdown">
          <g id="Vector"></g>
          <path d={svgPaths.pde2d500} fill="var(--fill-0, #FF0033)" id="Vector_2" opacity="0.1" />
          <path d={svgPaths.p15ec3100} id="Vector_3" stroke="var(--stroke-0, #FF0033)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
          <path d={svgPaths.p1ccb1e80} id="Vector_4" stroke="var(--stroke-0, #FF0033)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
          <g id="Vector_5">
            <path d={svgPaths.p2df12100} fill="var(--fill-0, #FF0033)" />
            <path d={svgPaths.p2df12100} stroke="var(--stroke-0, #FF0033)" />
          </g>
          <path d={svgPaths.p12753300} fill="var(--fill-0, #FF0033)" id="Vector_6" />
          <path d={svgPaths.p29675280} fill="var(--fill-0, #FF0033)" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-[#fff2f5] box-border content-stretch flex gap-[10px] items-center p-[40px] relative rounded-[1000px] shrink-0" data-name="icon">
      <ClockCountdown />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center not-italic relative shrink-0 text-center w-full" data-name="title">
      <p className="font-['Coiny:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[40px] text-black text-nowrap whitespace-pre">Opps!</p>
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] min-w-full relative shrink-0 text-[#717171] text-[16px]" style={{ width: "min-content" }}>
        This session is expired. Kindly go back to login and try again
      </p>
    </div>
  );
}

function WebButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#007aff] h-[56px] relative rounded-[50px] shrink-0 w-full cursor-pointer"
      data-name="web_Button"
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center p-[16px] relative w-full">
          <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white whitespace-pre">Back to login</p>
        </div>
      </div>
    </button>
  );
}

function X() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="X">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_2063_12657)" id="X">
          <g id="Vector"></g>
          <path d="M18.75 5.25L5.25 18.75" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M18.75 18.75L5.25 5.25" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2063_12657">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Component00IconResizer() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="00-icon-resizer">
      <X />
    </div>
  );
}

function Delete({ onClose }: { onClose?: () => void }) {
  if (!onClose) return null;
  
  return (
    <button
      onClick={onClose}
      className="absolute bg-[rgba(0,0,0,0)] box-border content-stretch flex gap-[8px] items-center justify-center p-[16px] right-0 rounded-[50px] size-[56px] top-0 cursor-pointer"
      data-name="delete"
    >
      <Component00IconResizer />
    </button>
  );
}

export default function AuthExpired({ onBackToLogin, onClose }: AuthExpiredProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffbfb]">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white relative rounded-[24px] w-full max-w-lg" data-name="auth #expired">
          <div className="flex flex-col items-center relative">
            <div className="box-border content-stretch flex flex-col gap-[24px] items-center pb-[40px] pt-[64px] px-[40px] relative w-full">
              <Icon />
              <Title />
              <WebButton onClick={onBackToLogin} />
              <Delete onClose={onClose} />
            </div>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
}
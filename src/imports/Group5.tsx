import svgPaths from "./svg-7muonmzooj";
import imgLogo from "figma:asset/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";

function Logo() {
  return (
    <div className="aspect-[32/24] basis-0 grow min-h-px min-w-px relative shrink-0" data-name="logo">
      <div className="absolute aspect-[53/40] bg-center bg-contain bg-no-repeat bottom-[-1px] top-0 translate-x-[-50%]" data-name="logo" style={{ left: "calc(50% - 0.845px)", backgroundImage: `url('${imgLogo}')` }} />
    </div>
  );
}

function Logo1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-full items-start justify-center max-w-[120px] min-w-[24px] relative shrink-0" data-name="logo">
      <Logo />
    </div>
  );
}

function Copyright() {
  return (
    <div className="content-stretch flex gap-[24px] h-full items-center relative shrink-0" data-name="copyright">
      <Logo1 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[24px] whitespace-pre">Copyright © 2025 RCCG Living Word Forney. All Rights Reserved.</p>
      </div>
    </div>
  );
}

function Privacy() {
  return (
    <div className="bg-[rgba(0,0,0,0)] box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[4px] py-[8px] relative rounded-[50px] shrink-0" data-name="privacy">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bfbfbf] text-[14px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Privacy Policy</p>
      </div>
    </div>
  );
}

function Tos() {
  return (
    <div className="bg-[rgba(0,0,0,0)] box-border content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[4px] py-[8px] relative rounded-[50px] shrink-0" data-name="TOS">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bfbfbf] text-[14px] text-nowrap">
        <p className="leading-[24px] whitespace-pre">Terms of Service</p>
      </div>
    </div>
  );
}

function Legals() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-[273px]" data-name="legals">
      <Privacy />
      <div className="relative shrink-0 size-[8px]" data-name="dot">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, #BFBFBF)" id="dot" r="4" />
        </svg>
      </div>
      <Tos />
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-[#00438c] box-border content-stretch flex gap-[24px] h-[40px] items-center justify-center left-px px-[120px] py-[8px] top-[845px] w-[1247px]" data-name="footer">
      <Copyright />
      <Legals />
    </div>
  );
}

function Logo2() {
  return (
    <div className="h-[60px] relative shrink-0 w-[80px]" data-name="logo">
      <div className="absolute aspect-[53/40] bg-center bg-contain bg-no-repeat bottom-[-1px] top-0 translate-x-[-50%]" data-name="logo" style={{ left: "calc(50% - 0.845px)", backgroundImage: `url('${imgLogo}')` }} />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center relative shrink-0 w-full" data-name="title">
      <Logo2 />
      <p className="font-['Coiny:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[40px] text-black text-nowrap whitespace-pre">Reset password</p>
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] min-w-full not-italic relative shrink-0 text-[#717171] text-[14px] text-center" style={{ width: "min-content" }}>
        Email verification successful! Create your new password
      </p>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Create new password</p>
    </div>
  );
}

function House1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="House">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="House">
          <g id="Vector"></g>
          <path d={svgPaths.p2c1e3680} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Component00IconResizer() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="00-icon-resizer">
      <House1 />
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="text">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#bfbfbf] text-[16px] text-nowrap whitespace-pre">Create new password</p>
    </div>
  );
}

function Input() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="input">
      <Component00IconResizer />
      <Text />
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-white h-[40px] min-h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="inputField">
      <div aria-hidden="true" className="absolute border border-[#d5d5d5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-px h-[40px] items-center min-h-inherit px-[16px] py-[8px] relative w-full">
          <Input />
        </div>
      </div>
    </div>
  );
}

function HintContainer() {
  return <div className="box-border content-stretch flex gap-[10px] h-[24px] items-start justify-center pb-[8px] pt-0 px-0 shrink-0 w-full" data-name="hintContainer" />;
}

function FieldInput() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="field_Input">
      <InputField />
      <HintContainer />
    </div>
  );
}

function FieldGroupInput() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="fieldGroup_Input">
      <Label />
      <FieldInput />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Repeat password</p>
    </div>
  );
}

function House3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="House">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="House">
          <g id="Vector"></g>
          <path d={svgPaths.p2c1e3680} id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Component00IconResizer1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="00-icon-resizer">
      <House3 />
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="text">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#bfbfbf] text-[16px] text-nowrap whitespace-pre">Confirm new password</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="input">
      <Component00IconResizer1 />
      <Text1 />
    </div>
  );
}

function InputField1() {
  return (
    <div className="bg-white h-[40px] min-h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="inputField">
      <div aria-hidden="true" className="absolute border border-[#d5d5d5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-px h-[40px] items-center min-h-inherit px-[16px] py-[8px] relative w-full">
          <Input1 />
        </div>
      </div>
    </div>
  );
}

function HintContainer1() {
  return <div className="box-border content-stretch flex gap-[10px] h-[24px] items-start justify-center pb-[8px] pt-0 px-0 shrink-0 w-full" data-name="hintContainer" />;
}

function FieldInput1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="field_Input">
      <InputField1 />
      <HintContainer1 />
    </div>
  );
}

function FieldGroupInput1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="fieldGroup_Input">
      <Label1 />
      <FieldInput1 />
    </div>
  );
}

function Input2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="input">
      <FieldGroupInput />
      <FieldGroupInput1 />
    </div>
  );
}

function WebButton() {
  return (
    <div className="bg-[#007aff] h-[56px] relative rounded-[50px] shrink-0 w-full" data-name="web_Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center p-[16px] relative w-full">
          <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white whitespace-pre">Reset</p>
        </div>
      </div>
    </div>
  );
}

function Action() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="action">
      <WebButton />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[480px]" data-name="form">
      <Input2 />
      <Action />
    </div>
  );
}

function ArrowLeft() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ArrowLeft">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_2063_26017)" id="ArrowLeft">
          <g id="Vector"></g>
          <path d="M20.25 12H3.75" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3687c698} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <clipPath id="clip0_2063_26017">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Component00IconResizer2() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0" data-name="00-icon-resizer">
      <ArrowLeft />
    </div>
  );
}

function Back() {
  return (
    <button className="absolute bg-[rgba(0,0,0,0)] box-border content-stretch cursor-pointer flex gap-[8px] h-[56px] items-center justify-center left-0 overflow-visible p-[16px] rounded-[50px] top-0 w-[64px]" data-name="back">
      <Component00IconResizer2 />
    </button>
  );
}

function AuthResetNewPswd() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[24px] items-center p-[40px] relative rounded-[24px] shrink-0 w-[560px]" data-name="auth #reset/newPswd">
      <Title />
      <Form />
      <Back />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[792px] items-center justify-center left-0 px-0 py-[40px] top-[30px] w-[1200px]" data-name="main">
      <AuthResetNewPswd />
    </div>
  );
}

export default function Group5() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#fffbfb] h-[861px] left-px top-0 w-[1247px]" />
      <Footer />
      <Main />
    </div>
  );
}
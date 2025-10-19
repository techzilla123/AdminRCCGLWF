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
    <div className="absolute bg-[#00438c] box-border content-stretch flex gap-[24px] h-[40px] items-center justify-center left-0 px-[120px] py-[8px] top-[845px] w-[1247px]" data-name="footer">
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
    <div className="content-stretch flex flex-col gap-[4px] items-center justify-center not-italic relative shrink-0 w-full" data-name="title">
      <p className="font-['Coiny:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[40px] text-black text-nowrap whitespace-pre">Forgot password</p>
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] min-w-full relative shrink-0 text-[#717171] text-[14px] text-center" style={{ width: "min-content" }}>
        Can’t remember your password, we’ve got you covered!
      </p>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="label">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Email</p>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0" data-name="text">
      <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#717171] text-[16px] text-nowrap whitespace-pre">johndoe@email.com</p>
    </div>
  );
}

function Input() {
  return (
    <div className="basis-0 content-stretch flex gap-[12px] grow items-center min-h-px min-w-px relative shrink-0" data-name="input">
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

function WebButton() {
  return (
    <div className="bg-[#007aff] h-[56px] relative rounded-[50px] shrink-0 w-full" data-name="web_Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center p-[16px] relative w-full">
          <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white whitespace-pre">Reset password</p>
        </div>
      </div>
    </div>
  );
}

function WebButton1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] h-[56px] relative rounded-[50px] shrink-0 w-full" data-name="web_Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[56px] items-center justify-center p-[16px] relative w-full">
          <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Inter:Medium',_sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap underline whitespace-pre">Back to Login</p>
        </div>
      </div>
    </div>
  );
}

function Action() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="action">
      <WebButton />
      <WebButton1 />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[480px]" data-name="form">
      <FieldGroupInput />
      <Action />
    </div>
  );
}

function AuthAuthReset() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[24px] items-center p-[40px] relative rounded-[24px] shrink-0 w-[560px]" data-name="auth #auth #reset">
      <Logo2 />
      <Title />
      <Form />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[792px] items-center justify-center left-[19px] px-0 py-[40px] top-[33px] w-[1200px]" data-name="main">
      <AuthAuthReset />
    </div>
  );
}

export default function Group4() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-[#fffbfb] h-[861px] left-0 top-0 w-[1247px]" />
      <Footer />
      <Main />
    </div>
  );
}
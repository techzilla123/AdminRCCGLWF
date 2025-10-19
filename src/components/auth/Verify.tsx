import { useState } from 'react';
import imgLogo from "figma:asset/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";
import { AuthFooter } from './AuthFooter';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface VerifyProps {
  email: string;
  type: 'setup' | 'forgot';
  onVerify: (code: string) => void;
  onBackToLogin: () => void;
  onResendCode: () => void;
  error?: string | null;
  onClearError?: () => void;
}

function Logo() {
  return (
    <div className="h-[60px] relative shrink-0 w-[80px]" data-name="logo">
      <div className="absolute aspect-[53/40] bg-center bg-contain bg-no-repeat bottom-[-1px] top-0 translate-x-[-50%]" 
           data-name="logo" 
           style={{ left: "calc(50% - 0.845px)", backgroundImage: `url('${imgLogo}')` }} />
    </div>
  );
}

function Logo1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-full items-start justify-center max-w-[120px] min-w-[24px] relative shrink-0" data-name="logo">
      <div className="aspect-[32/24] basis-0 grow min-h-px min-w-px relative shrink-0" data-name="logo">
        <div className="absolute aspect-[53/40] bg-center bg-contain bg-no-repeat bottom-[-1px] top-0 translate-x-[-50%]" 
             data-name="logo" 
             style={{ left: "calc(50% - 0.845px)", backgroundImage: `url('${imgLogo}')` }} />
      </div>
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

export default function Verify({ email, type, onVerify, onBackToLogin, onResendCode, error, onClearError }: VerifyProps) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      setIsLoading(true);
      onVerify(code);
    }
  };

  const handleResend = () => {
    setVerificationCode(['', '', '', '', '', '']);
    onResendCode();
  };

  return (
    <>
      <AlertDialog open={!!error} onOpenChange={(open) => !open && onClearError?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verification Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClearError}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="min-h-screen flex flex-col bg-[#fffbfb]">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white flex flex-col gap-6 items-center p-6 md:p-10 rounded-3xl w-full max-w-lg">
          
          {/* Logo */}
          <Logo />

          {/* Title */}
          <div className="flex flex-col gap-1 items-center justify-center w-full" data-name="title">
            <h1 className="font-['Coiny',_sans-serif] text-4xl text-black">
              Verify email
            </h1>
            <p className="font-['Inter',_sans-serif] font-normal text-sm text-[#717171] text-center">
              {type === 'setup' 
                ? 'We have sent a verification code to your email address. Enter the code to continue setting up your admin account.'
                : 'We have sent a password reset code to your email address. Enter the code to continue with password reset.'
              }
            </p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="font-['Inter',_sans-serif] font-medium text-base text-blue-800">
                {email}
              </p>
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="flex flex-col w-full max-w-md space-y-6">
            <div className="flex flex-col gap-2">
              <label className="font-['Inter',_sans-serif] font-normal text-base text-black">
                Verification code
              </label>
              
              <div className="flex gap-3 justify-center w-full">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-['Inter',_sans-serif] font-semibold border-2 border-[#d5d5d5] rounded-lg focus:border-[#007aff] focus:outline-none transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleVerify}
                disabled={verificationCode.join('').length !== 6 || isLoading}
                className={`bg-[#007aff] h-14 rounded-full w-full flex items-center justify-center transition-colors ${
                  verificationCode.join('').length !== 6 || isLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#0056d6]'
                }`}
              >
                <span className="font-['Inter',_sans-serif] font-medium text-base text-white">
                  {isLoading ? 'Verifying...' : 'Verify'}
                </span>
              </button>
              
              <div className="flex justify-between">
                <button
                  onClick={handleResend}
                  className="font-['Inter',_sans-serif] font-normal text-sm text-blue-600 underline hover:no-underline"
                >
                  Resend code
                </button>
                <button
                  onClick={onBackToLogin}
                  className="font-['Inter',_sans-serif] font-normal text-sm text-gray-600 underline hover:no-underline"
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        <AuthFooter />
      </div>
    </>
  );
}
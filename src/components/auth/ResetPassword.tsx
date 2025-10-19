import { useState } from 'react';
import svgPaths from "../../imports/svg-7muonmzooj";
import imgLogo from "figma:asset/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";
import { AuthFooter } from './AuthFooter';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface ResetPasswordProps {
  email: string;
  onResetPassword: (newPassword: string) => void;
  onBackToLogin: () => void;
  error?: string | null;
  onClearError?: () => void;
}

function Logo() {
  return (
    <div className="h-[60px] relative shrink-0 w-[80px]" data-name="logo">
      <div className="absolute aspect-[53/40] bg-center bg-contain bg-no-repeat bottom-[-1px] top-0 translate-x-[-50%]" data-name="logo" style={{ left: "calc(50% - 0.845px)", backgroundImage: `url('${imgLogo}')` }} />
    </div>
  );
}

function Title({ email }: { email: string }) {
  return (
    <div className="flex flex-col gap-1 items-center justify-center w-full" data-name="title">
      <Logo />
      <h1 className="font-['Coiny',_sans-serif] text-4xl text-black">Reset password</h1>
      <p className="font-['Inter',_sans-serif] font-normal text-sm text-[#717171] text-center">
        Email verification successful for {email}! Create your new password
      </p>
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

export default function ResetPassword({ email, onResetPassword, onBackToLogin, error, onClearError }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    const error = value !== newPassword ? 'Passwords do not match' : '';
    setErrors(prev => ({ ...prev, confirm: error }));
  };

  const handleSubmit = () => {
    const passwordError = validatePassword(newPassword);
    const confirmError = confirmPassword !== newPassword ? 'Passwords do not match' : '';
    
    setErrors({ password: passwordError, confirm: confirmError });

    if (!passwordError && !confirmError && newPassword && confirmPassword) {
      setIsLoading(true);
      onResetPassword(newPassword);
    }
  };

  return (
    <>
      <AlertDialog open={!!error} onOpenChange={(open) => !open && onClearError?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password Error</AlertDialogTitle>
            <AlertDialogDescription>
              {error}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onClearError}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="min-h-screen w-full bg-[#fffbfb] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[560px] mx-auto">
          <div className="bg-white box-border content-stretch flex flex-col gap-[24px] items-center p-[40px] relative rounded-[24px] shrink-0 w-full" data-name="auth #reset/newPswd">
            <Title email={email} />
            
            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full max-w-[480px]" data-name="form">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="input">
                
                {/* Create new password */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mb-4" data-name="fieldGroup_Input">
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="label">
                    <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Create new password</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="field_Input">
                    <div className="bg-white h-[40px] min-h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="inputField">
                      <div aria-hidden="true" className="absolute border border-[#d5d5d5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
                      <div className="flex flex-row items-center min-h-inherit relative size-full">
                        <div className="box-border content-stretch flex gap-px h-[40px] items-center min-h-inherit px-[16px] py-[8px] relative w-full">
                          <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="input">
                            <Component00IconResizer />
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => handlePasswordChange(e.target.value)}
                              placeholder="Create new password"
                              className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0 bg-transparent outline-none font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic text-[16px] text-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Repeat password */}
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mb-6" data-name="fieldGroup_Input">
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="label">
                    <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Repeat password</p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="field_Input">
                    <div className="bg-white h-[40px] min-h-[40px] relative rounded-[8px] shrink-0 w-full" data-name="inputField">
                      <div aria-hidden="true" className="absolute border border-[#d5d5d5] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
                      <div className="flex flex-row items-center min-h-inherit relative size-full">
                        <div className="box-border content-stretch flex gap-px h-[40px] items-center min-h-inherit px-[16px] py-[8px] relative w-full">
                          <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="input">
                            <Component00IconResizer />
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                              placeholder="Confirm new password"
                              className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0 bg-transparent outline-none font-['Inter:Regular',_sans-serif] font-normal leading-[24px] not-italic text-[16px] text-black"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {errors.confirm && (
                      <p className="text-red-500 text-sm">{errors.confirm}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="action">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !newPassword || !confirmPassword || !!errors.password || !!errors.confirm}
                  className={`bg-[#007aff] h-[56px] relative rounded-[50px] shrink-0 w-full flex items-center justify-center ${
                    isLoading || !newPassword || !confirmPassword || !!errors.password || !!errors.confirm 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-[#0056cc] transition-colors'
                  }`}
                  data-name="web_Button"
                >
                  <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[24px] not-italic text-[16px] text-center text-nowrap text-white whitespace-pre">
                    {isLoading ? 'Resetting...' : 'Reset'}
                  </p>
                </button>
              </div>
            </div>

            <button 
              onClick={onBackToLogin}
              className="absolute bg-[rgba(0,0,0,0)] box-border content-stretch cursor-pointer flex gap-[8px] h-[56px] items-center justify-center left-0 overflow-visible p-[16px] rounded-[50px] top-0 w-[64px] hover:bg-gray-100 transition-colors" 
              data-name="back"
            >
              <Component00IconResizer2 />
            </button>
          </div>
        </div>
        </div>

        {/* Footer */}
        <AuthFooter />
      </div>
    </>
  );
}
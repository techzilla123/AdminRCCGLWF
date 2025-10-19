import { useState } from 'react';
import imgLogo from "figma:asset/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";
import { AuthFooter } from './AuthFooter';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface ForgotPasswordProps {
  onSubmit: (email: string) => void;
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

function Title() {
  return (
    <div className="flex flex-col gap-1 items-center justify-center w-full" data-name="title">
      <h1 className="font-['Coiny',_sans-serif] text-4xl text-black">Forgot password</h1>
      <p className="font-['Inter',_sans-serif] font-normal text-sm text-[#717171] text-center">
        Can't remember your password, we've got you covered!
      </p>
    </div>
  );
}

export function ForgotPassword({ onSubmit, onBackToLogin, error, onClearError }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <>
      <AlertDialog open={!!error} onOpenChange={(open) => !open && onClearError?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
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
        <form onSubmit={handleSubmit} className="bg-white flex flex-col gap-6 items-center p-6 md:p-10 rounded-3xl w-full max-w-lg">
          <Logo />
          <Title />
          
          <div className="flex flex-col w-full max-w-md space-y-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-['Inter',_sans-serif] font-normal text-base text-black">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@email.com"
                  className="w-full h-10 px-4 py-2 border border-[#d5d5d5] rounded-lg bg-white font-['Inter',_sans-serif] font-normal text-base text-[#717171] outline-none focus:border-[#007aff] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1">
              <button
                type="submit"
                className="bg-[#007aff] h-14 rounded-full w-full flex items-center justify-center hover:bg-[#0056d6] transition-colors"
              >
                <span className="font-['Inter',_sans-serif] font-medium text-base text-white">Reset password</span>
              </button>
              
              <button
                type="button"
                onClick={onBackToLogin}
                className="h-14 rounded-full w-full flex items-center justify-center bg-transparent hover:bg-gray-50 transition-colors"
              >
                <span className="font-['Inter',_sans-serif] font-medium text-base text-black underline">Back to Login</span>
              </button>
            </div>
          </div>
        </form>
        </div>
        
        <AuthFooter />
      </div>
    </>
  );
}
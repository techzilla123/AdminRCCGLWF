import { useState } from 'react';
import svgPaths from "../../imports/svg-piriif8h46";
import imgLogo from "figma:asset/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";
import { AuthFooter } from './AuthFooter';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface SetupAdminProps {
  onSubmit: (email: string, password: string) => void;
  onSwitchToLogin: () => void;
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

function Logo1() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] h-[24px] items-start justify-center max-w-[120px] min-w-[24px] relative shrink-0" data-name="logo">
      <Logo />
    </div>
  );
}

function Title() {
  return (
    <div className="flex flex-col gap-1 items-center justify-center w-full" data-name="title">
      <h1 className="font-['Coiny',_sans-serif] text-4xl text-black">Setup admin</h1>
      <p className="font-['Inter',_sans-serif] font-normal text-sm text-[#717171] text-center">
        Setup admin control to monitor your site activity.<br />
        This can only be done once
      </p>
    </div>
  );
}

function House7() {
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

export function SetupAdmin({ onSubmit, onSwitchToLogin, error, onClearError }: SetupAdminProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSubmit(email, password);
    }
  };

  return (
    <>
      <AlertDialog open={!!error} onOpenChange={(open) => !open && onClearError?.()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setup Error</AlertDialogTitle>
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
          <Logo1 />
          <Title />
          
          <div className="flex flex-col w-full max-w-md space-y-4">
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
                  placeholder="chrisdoe@email.com"
                  className="w-full h-10 px-4 py-2 border border-[#d5d5d5] rounded-lg bg-white font-['Inter',_sans-serif] font-normal text-base text-[#717171] outline-none focus:border-[#007aff] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="font-['Inter',_sans-serif] font-normal text-base text-black">
                Password
              </label>
              <div className="relative">
                <div className="flex items-center w-full h-10 border border-[#d5d5d5] rounded-lg bg-white focus-within:border-[#007aff] transition-colors">
                  <div className="px-3">
                    <House7 />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="flex-1 h-full pr-4 bg-transparent font-['Inter',_sans-serif] font-normal text-base text-[#717171] outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1 mt-6">
              <button
                type="submit"
                className="bg-[#007aff] h-14 rounded-full w-full flex items-center justify-center hover:bg-[#0056d6] transition-colors"
              >
                <span className="font-['Inter',_sans-serif] font-medium text-base text-white">Create admin</span>
              </button>
              
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="h-14 rounded-full w-full flex items-center justify-center bg-transparent hover:bg-gray-50 transition-colors"
              >
                <span className="font-['Inter',_sans-serif] font-medium text-base text-black underline">Login instead</span>
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
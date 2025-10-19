import imgLogo from "figma:asset/1946cb0be5574afee8f4a1c39bcd6831554ed91a.png";

export function AuthFooter() {
  return (
    <footer className="w-full bg-[#00438c] mt-auto">
      <div className="min-h-[40px] w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-24 py-2">
        <div className="flex items-center gap-3 order-2 sm:order-1">
          <div className="h-6 w-8 relative shrink-0">
            <div 
              className="absolute aspect-[53/40] bg-center bg-contain bg-no-repeat inset-0" 
              style={{ backgroundImage: `url('${imgLogo}')` }} 
            />
          </div>
          <div className="flex flex-col">
            <p className="text-white text-sm leading-6 font-['Inter',_sans-serif] font-normal text-center sm:text-left">
              Copyright © 2025 RCCG Living Word Forney. All Rights Reserved.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <div className="px-1 py-2">
            <p className="text-[#bfbfbf] text-sm leading-6 font-['Inter',_sans-serif] font-normal">
              Privacy Policy
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#bfbfbf]" />
          <div className="px-1 py-2">
            <p className="text-[#bfbfbf] text-sm leading-6 font-['Inter',_sans-serif] font-normal">
              Terms of Service
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
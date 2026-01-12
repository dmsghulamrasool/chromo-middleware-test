import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col w-full bg-(--global-black)">
      <div className="flex justify-between items-center pl-18.5 pr-16 pt-8.5 pb-8.5">
        <div className="flex items-center gap-1">
          <img
            src="/svg/chromos-logo.png"
            alt="Chromos"
            className="w-13 h-13"
          />
          <span className="font-inter pt-[7.25px] font-semibold text-[32px] tracking-tighter text-(--global-white)">
            chromos
          </span>
        </div>
        <div className="flex items-center gap-14">
          <Link
            href="/blog"
            className="font-inter font-medium text-base text-(--global-white) cursor-pointer"
          >
            Blog
          </Link>
          <Link
            href="/help"
            className="font-inter font-medium text-base text-(--global-white) cursor-pointer"
          >
            Help Center
          </Link>
          <Link
            href="/contact"
            className="font-inter font-medium text-base text-(--global-white) cursor-pointer"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="w-full h-px bg-[#C3C3C3]" />

      <div className="flex justify-between items-center px-16 pt-4.75 pb-7.25">
        <div className="flex items-center gap-4">
          <Link
            href="/terms"
            className="font-poppins font-normal text-[13.4px] text-[#A5A5A5] cursor-pointer"
          >
            Terms of Services
          </Link>
          <Link
            href="/privacy"
            className="font-poppins font-normal text-[13.4px] text-[#A5A5A5] cursor-pointer"
          >
            Privacy Policy
          </Link>
        </div>
        <span className="font-poppins font-medium text-[13.4px] text-[#A5A5A5]">
          SprintX Pvt Ltd © 2024. All rights reserved
        </span>
        <div className="flex items-center gap-5.5">
          <Link href="#" className="cursor-pointer">
            <img
              src="/svg/icon-facebook.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
          </Link>
          <Link href="#" className="cursor-pointer">
            <img
              src="/svg/icon-linkedin.svg"
              alt="LinkedIn"
              className="w-5 h-5"
            />
          </Link>
          <Link href="#" className="cursor-pointer">
            <img src="/svg/icon-x.svg" alt="X" className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Button } from "../ui/button";
import PlanCard from "./components/plan-card";

const features = [
  "Unlimited palettes",
  "Advanced LUMA with cultural context",
  "Full Isla explanations",
  "Priority ADA optimization",
];

const PricingSection = () => {
  return (
    <div className="relative flex flex-col items-center gap-16 pt-[121px] pb-[74px] px-20 bg-(--surface-primary) overflow-hidden">
      <div className="absolute inset-0 top-240 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[584px] h-[117px] left-0 top-[600px] rounded-full blur-[95px] opacity-60"
          style={{ backgroundColor: "var(--blob-orange)" }}
        />
        <div
          className="absolute w-[584px] h-[97px] right-0 top-[700px] rounded-full blur-[95px] opacity-60"
          style={{ backgroundColor: "var(--blob-yellow)" }}
        />
        <div
          className="absolute w-[616px] h-[161px] left-1/4 top-[550px] rounded-full blur-[99px] opacity-20"
          style={{ backgroundColor: "var(--blob-green)" }}
        />
      </div>

      <h1 className="font-inter font-extralight text-[64px] leading-[1.06] text-center text-[#212121] z-10">
        Pick your way to{" "}
        <span className="title font-semibold text-transparent">Create</span>{" "}
      </h1>

      <div className="flex flex-row items-stretch justify-center gap-6 w-full max-w-[644px] z-10">
        <PlanCard
          badge="Free"
          badgeColor="grey"
          price="$0"
          duration="Forever"
          description="Perfect for trying Chromos"
          features={features}
          buttonText="Get started now"
        />
        <PlanCard
          badge="Most Popular"
          badgeColor="orange"
          price="$29"
          duration="per month"
          description="For professional designers"
          features={features}
          buttonText="Get started now"
        />
      </div>

      <div className="flex flex-row items-start justify-center gap-24 z-10">
        <div className="flex flex-col items-center">
          <span className="font-inter font-extrabold text-[100px] leading-[1.4] text-[#212121]">
            <span className="hover-text-stats">1</span>
            <span className="hover-text-stats">3M</span>
            <span className="hover-text-stats">+</span>
          </span>
          <span className="font-inter font-black text-[50px] leading-[1.4] text-[#757575]">
            <span className="hover-text-stats-sub">Palet</span>
            <span className="hover-text-stats-sub">tes cre</span>
            <span className="hover-text-stats-sub">ated</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-inter font-extrabold text-[100px] leading-[1.4] text-[#212121]">
            <span className="hover-text-stats">20</span>
            <span className="hover-text-stats">0K</span>
            <span className="hover-text-stats">+</span>
          </span>
          <span className="font-inter font-black text-[50px] leading-[1.4] text-[#757575]">
            <span className="hover-text-stats-sub">Creators</span>
            <span className="hover-text-stats-sub"> using</span>
            <span className="hover-text-stats-sub"> Chromos</span>
          </span>
        </div>
      </div>

      <div className="relative flex flex-row gap-[339px] items-center w-full  rounded-lg border-2 border-[#DEC67C] bg-(--porcelain-1) pt-[73px] pl-[61px] pb-[72px] justify-between z-10">
        <div className="flex flex-col items-start gap-[48px]">
          <div className="flex items-center justify-center rounded-[52px] bg-(--grey-7) px-2.5 py-1.5 w-fit">
            <span className="font-inter font-normal text-2xl px-[29.5px] py-[10px] leading-[1.06] text-(--global-white)">
              Enterprise
            </span>
          </div>

          <div className="flex flex-row items-center gap-[14px]">
            <img
              src="/svg/simple-line-icons_call-in.svg"
              alt=""
              className="w-[53px] h-[53px]"
            />
            <span className="font-inter font-medium text-[46px] text-nowrap leading-[1.06] text-[#212121]">
              Let&apos;s Chat
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-[27px] pt-[11px] pr-[72px]">
          <p className="font-inter font-normal text-[20px] leading-[1.38] text-[#212121]">
            Let&apos;s hop on a quick call to understand your product and goals.
            Our team will help you explore the right way forward with Chromos.
          </p>

          <Button
            variant="black"
            className=" rounded-[8px] px-[119px] py-[10px] font-poppins text-[16px] cursor-pointer"
          >
            Book a call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;

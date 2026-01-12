import { Button } from "../ui/button";

const GenerateSection = () => {
  return (
    <div className="flex justify-center items-center  bg-(--surface-primary)">
      <div className="relative w-[1275px] h-[681px] rounded-2xl bg-(--nav-sidebar-bg) border border-(--line) overflow-hidden">
        <img
          src="/svg/generate-decoration.svg"
          alt=""
          className="absolute left-[-47px] top-[-81px] w-[1422.93px] h-[234.23px] opacity-40 pointer-events-none z-0"
        />

        <div className="absolute inset-0 top-[-150px] pointer-events-none overflow-hidden z-0">
          <div
            className="absolute w-[584.9px] h-[116.57px] left-0 top-[44px] rounded-full blur-[95px] opacity-60"
            style={{ backgroundColor: "var(--blob-orange)" }}
          />
          <div
            className="absolute w-[584px] h-[97.23px] left-[818px] top-[137px] rounded-full blur-[95px] opacity-60"
            style={{ backgroundColor: "var(--blob-yellow)" }}
          />
          <div
            className="absolute w-[615.95px] h-[161px] left-[277px] top-0 rounded-full blur-[99px] opacity-20"
            style={{ backgroundColor: "var(--blob-green)" }}
          />
        </div>

        <h1 className="absolute left-[37px] top-[216px] w-[327px] font-inter font-extralight text-[64px] leading-[1.06] text-(--global-black) z-10">
          Generate perfect{" "}
          <span className="title font-bold text-transparent">Palettes!</span>
        </h1>

        <div className="absolute left-[37px] top-[441px] z-10">
          <Button
            variant="outline"
            className="w-[327px] h-[44px] px-4 py-[7.5px] text-base font-poppins font-medium rounded-lg border bg-(--global-black) text-(--global-white) cursor-pointer"
          >
            Create a custom color palette
          </Button>
        </div>

        <img
          src="/svg/generate-image.png"
          alt=""
          className="absolute left-[399px] top-[114px] w-[856px] h-[608px] rounded-[18px] shadow-[0px_3px_16.1px_5px_rgba(255,136,0,0.2)] z-10"
        />
      </div>
    </div>
  );
};

export default GenerateSection;

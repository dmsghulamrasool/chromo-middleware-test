import { Button } from "../ui/button";

const STARS = [1, 2, 3, 4, 5];

const CtaSection = () => {
  return (
    <div className="relative flex justify-center items-center pt-[94px] pb-[121px] bg-(--surface-primary) overflow-hidden">
      <div className="absolute inset-0 top-90 pointer-events-none z-0">
        <div
          className="absolute w-[615px] h-[161px] left-1/2 -translate-x-1/2 top-[40%] rounded-full blur-[99px] opacity-20"
          style={{ backgroundColor: "var(--blob-green)" }}
        />
        <div
          className="absolute w-[584px] h-[117px] left-0 top-[50%] rounded-full blur-[95px] opacity-60"
          style={{ backgroundColor: "var(--blob-orange)" }}
        />
        <div
          className="absolute w-[584px] h-[97px] right-0 top-[60%] rounded-full blur-[95px] opacity-60"
          style={{ backgroundColor: "var(--blob-yellow)" }}
        />
      </div>

      <div className="flex flex-col items-center gap-[74px] z-10">
        <h1 className="font-inter font-semibold text-[88px] leading-[1.06] text-center text-(--cta-title)">
          <span className="hover-text-cta">Ma</span>
          <span className="hover-text-cta">ke </span>
          <span className="hover-text-cta">your</span>
          <span className="hover-text-cta"> Pa</span>
          <span className="hover-text-cta">let</span>
          <span className="hover-text-cta">te </span>
          <span className="hover-text-cta">pop</span>
          <span className="hover-text-cta">!</span>
        </h1>

        <div className="flex flex-col items-center gap-6">
          <Button
            variant="outline"
            className="h-[68px] px-[59px] py-[16px] text-2xl font-poppins font-medium rounded-lg border bg-(--global-black) text-(--global-white) cursor-pointer"
          >
            Create a custom color palette
          </Button>

          <div className="flex flex-row items-end gap-2">
            <div className="flex flex-row items-center">
              {STARS.map((star) => (
                <img
                  key={star}
                  src="/svg/rating-star.svg"
                  alt=""
                  className="w-8 h-8"
                />
              ))}
            </div>
            <span className="font-inter font-medium text-[28px] leading-[1.21] text-(--cta-reviews)">
              200+ reviews · 200k+ users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;

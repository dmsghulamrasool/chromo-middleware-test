import { Button } from "../ui/button";
import { SinglePalette } from "@/constants/color-palettes";

const UploadSection = () => {
  return (
    <div className="flex justify-center gap-[143px] items-center px-8 pt-[122px] pb-[121px] bg-(--surface-primary)">
      <div className="flex flex-col gap-[38px]">
        <div className="w-123.5">
          <h1 className="font-inter font-light leading-normal text-[64px] text-(--global-black)">
            Get <span className="color-text-gradient font-bold">Colors</span>
            <br />
            From Your
            <br />
            Photos Instantly
          </h1>
        </div>
        <div>
          <Button
            variant="outline"
            className="px-33.5 py-2.5 text-base font-inter font-medium rounded-lg border text-(--global-white) bg-(--global-black) cursor-pointer"
          >
            Upload an Image
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative flex flex-row w-130.25 h-117.25 rounded-[14px] overflow-hidden group">
          {SinglePalette.map((color) => (
            <div
              key={color.id}
              className="flex-1 h-full"
              style={{ backgroundColor: color.hex }}
            />
          ))}

          <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
            <img
              src="/svg/television.svg"
              alt="Television"
              className="w-full object-cover transition-transform duration-700 ease-out translate-y-[-25%] group-hover:translate-y-[-140%]"
            />
          </div>
        </div>

        <div className="flex w-130.25">
          {SinglePalette.map((color) => (
            <div
              key={color.id}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <p className="text-[12px] text-(--global-black) font-medium">
                {color.name}
              </p>
              <p className="text-xs text-(--grey-7) opacity-70">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;

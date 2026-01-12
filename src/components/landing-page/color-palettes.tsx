import { colorPalettes } from "@/constants/color-palettes";
import { Button } from "../ui/button";

const ColorPalettes = () => {
  const displayedPalettes = colorPalettes.slice(0, 16);

  return (
    <div className="flex flex-col justify-start items-center  bg-(--global-black) py-16">
      <div className="flex  text-center pb-13.25">
        <h1 className="font-inter font-light text-[56px] text-(--surface-primary)">
          Explore Infinite{" "}
          <span className="color-palette-gradient font-bold">
            Color Palettes
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-x-6.5 gap-y-11.5 px-8 ">
        {displayedPalettes.map((palette) => (
          <div
            key={palette.id}
            className="relative group cursor-pointer overflow-hidden border border-(--line) w-[300px] h-[63px] rounded-lg"
          >
            <div className="flex flex-row w-full h-full">
              {palette.colors.map((color) => (
                <div
                  key={color.id}
                  className="flex-1 h-full"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-(--global-white) translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <p className="text-center text-sm py-1 px-3 text-(--global-black) font-medium">
                {palette.title}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-18">
        <Button
          variant="outline"
          className="px-32 py-2.5 text-base font-medium rounded-lg border bg-(--global-white) cursor-pointer"
        >
          Create a custom color palette
        </Button>
      </div>
    </div>
  );
};

export default ColorPalettes;

const FeaturesSection = () => {
  return (
    <div className="flex flex-col items-center gap-14  bg-(--surface-primary)">
      <div className="flex flex-col items-center gap-6 max-w-[767px]">
        <h1 className="font-inter font-light text-[64px] leading-[1.21] text-center text-(--global-black)">
          Endlessly{" "}
          <span className="customizable-gradient font-semibold">
            Customizable
          </span>{" "}
          and convenient
        </h1>
        <p className="font-inter font-normal text-xl leading-[1.21] text-center text-(--global-black)">
          Explore limitless inspiration using our color palette generator.
        </p>
      </div>

      <div className="flex flex-col items-center gap-10 max-w-[1280px]">
        <div className="flex flex-row items-center gap-10">
          <div className="relative w-[400px] h-[394px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-(--nav-sidebar-bg) rounded-lg" />

            <img
              src="/svg/palette-generator-bg.png"
              alt=""
              className="absolute left-[5px] top-[166px] w-[391px] h-[196px] pointer-events-none"
            />

            <div className="absolute left-[34px] top-[45px] flex flex-col items-center gap-4 w-[333px] z-10">
              <div className="flex flex-row items-center gap-[7px]">
                <img
                  src="/svg/palette-generator-icon.svg"
                  alt=""
                  className="w-6 h-6"
                />
                <h3 className="font-inter font-medium text-[28px] leading-[1.21] text-(--global-black)">
                  Palette Generator
                </h3>
              </div>

              <p className="font-inter font-medium text-base leading-[1.21] text-center text-(--grey-7)">
                Turn ideas, photos, and moods into beautiful color sets.
              </p>
            </div>
          </div>

          <div className="relative w-[400px] h-[394px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-(--nav-sidebar-bg) rounded-xl" />

            <img
              src="/svg/image-picker-palette.svg"
              alt=""
              className="absolute left-8 top-[166px] w-[334px] h-[56px] pointer-events-none"
            />

            <img
              src="/svg/image-picker-bg.png"
              alt=""
              className="absolute left-8 top-[222px] w-[334px] h-[143px] rounded-b-lg pointer-events-none"
            />

            <div className="absolute left-[18px] top-[45px] flex flex-col items-center gap-4 w-[365px] z-10">
              <div className="flex flex-row items-center gap-[5px]">
                <img
                  src="/svg/image-picker-icon.svg"
                  alt=""
                  className="w-6 h-6"
                />
                <h3 className="font-inter font-semibold text-[28px] leading-[1.21] text-(--global-black)">
                  Image Picker
                </h3>
              </div>

              <p className="font-inter font-medium text-base leading-[1.21] text-center text-(--grey-7) w-[352px]">
                Capture colors from images and create perfect palettes
                instantly.
              </p>
            </div>
          </div>

          <div className="relative w-[400px] h-[394px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-(--nav-sidebar-bg) rounded-lg" />

            <img
              src="/svg/color-picker-bg.png"
              alt=""
              className="absolute left-10 top-[174px] w-[321px] h-[126px] rounded-lg pointer-events-none"
            />

            <img
              src="/svg/picker-front.svg"
              alt=""
              className="absolute left-[69px] top-[170px] w-[264px] h-[236px] picker-shadow pointer-events-none"
            />

            <div className="absolute left-5 top-[45px] flex flex-col items-center gap-4 w-[360px] z-10">
              <div className="flex flex-row justify-center items-center gap-[5px]">
                <img
                  src="/svg/color-picker-icon.svg"
                  alt=""
                  className="w-6 h-6"
                />
                <h3 className="font-inter font-semibold text-[28px] leading-[1.21] text-(--global-black)">
                  Color Picker
                </h3>
              </div>

              <p className="font-inter font-medium text-base leading-[1.21] text-center text-(--grey-7) w-[298px]">
                Capture colors from images and create perfect palettes
                instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-10">
          <div className="relative w-[400px] h-[450px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-(--nav-sidebar-bg) rounded-lg" />

            <img
              src="/svg/accessibility-bg.png"
              alt=""
              className="absolute left-5 top-[194px] w-[359px] h-[256px] pointer-events-none"
            />

            <div className="absolute left-[35px] top-[38px] flex flex-col gap-[15px] w-[338px] z-10">
              <div className="flex flex-row items-center gap-[9px]">
                <img
                  src="/svg/accessibility-icon.svg"
                  alt=""
                  className="w-6 h-6"
                />
                <h3 className="font-inter font-semibold text-[28px] leading-[1.21] text-center text-(--global-black) w-[305px]">
                  One-Click Accessibility Insights
                </h3>
              </div>

              <p className="font-inter font-medium text-base leading-[1.21] text-center text-(--grey-7)">
                Get instant contrast ratios, color reasoning, and clear
                guidelines to ensure your palette is fully accessible.
              </p>
            </div>
          </div>

          <div className="relative w-[400px] h-[450px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-(--nav-sidebar-bg) rounded-lg" />

            <img
              src="/svg/contrast-checker-bg.png"
              alt=""
              className="absolute left-3 top-[200px] w-[376px] h-[191px] pointer-events-none"
            />

            <img
              src="/svg/contrast-checker.svg"
              alt=""
              className="absolute left-[52px] top-[308px] w-[163px] h-[93px] pointer-events-none"
            />

            <div className="absolute left-10 top-[49px] flex flex-col items-center gap-4 w-[316px] z-10">
              <div className="flex flex-row items-center gap-1.5">
                <img
                  src="/svg/contrast-checker-icon.svg"
                  alt=""
                  className="w-6 h-6"
                />
                <h3 className="font-inter font-semibold text-[28px] leading-[1.21] text-(--global-black)">
                  Contrast Ckecker
                </h3>
              </div>

              <p className="font-inter font-medium text-base leading-[1.21] text-center text-(--grey-7)">
                Calculate the contrast ratio of text and background colors to
                make your color more accessible
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

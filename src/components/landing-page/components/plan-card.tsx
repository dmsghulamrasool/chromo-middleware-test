import { Button } from "@/components/ui/button";

type PlanCardProps = {
  badge: string;
  badgeColor: "grey" | "orange";
  price: string;
  duration: string;
  description: string;
  features: string[];
  buttonText: string;
};

const PlanCard = ({
  badge,
  badgeColor,
  price,
  duration,
  description,
  features,
  buttonText,
}: PlanCardProps) => {
  const badgeBgClass =
    badgeColor === "orange" ? "bg-[#D58D0B]" : "bg-(--grey-7)";

  return (
    <div className="relative flex flex-col flex-1 min-w-[604px]  rounded-lg border-2 border-[#DEC67C] bg-(--porcelain-1) pt-[61px] px-[64px] pb-[44px] ">
      <div
        className={`flex items-center justify-center rounded-[26px] ${badgeBgClass} px-2.5 py-1.5 w-fit`}
      >
        <span className="font-inter font-normal text-2xl px-[29.5px] py-[10px] leading-[1.06] text-(--global-white)">
          {badge}
        </span>
      </div>

      <div className="flex flex-row items-baseline gap-1 pt-[31px]">
        <span className="font-inter font-medium text-[64px] leading-[1.06] text-[#212121]">
          {price}
        </span>
        <span className="font-inter font-medium text-2xl leading-[1.06] text-[#212121]">
          {duration}
        </span>
      </div>

      <p className="font-inter font-normal text-[20px] leading-[1.06] text-[#212121] pt-[19px]">
        {description}
      </p>

      <div className="flex flex-col items-start gap-1 pt-[48px] pb-[50px]">
        <span className="font-inter font-medium text-[26px] leading-[1.06] text-[#212121]">
          What&apos;s include in this package
        </span>
        <ul className="flex flex-col pt-[16px] list-disc ml-4">
          {features.map((feature) => (
            <li
              key={feature}
              className="font-inter font-normal text-[20px] leading-[1.64] text-(--sidebar-text-secondary)"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="black"
        className=" rounded-[8px] font-poppins text-[16px] cursor-pointer px-[98.5px] py-[10px]"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PlanCard;

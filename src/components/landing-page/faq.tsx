const FAQSection = () => {
  const faqItems = [
    { id: 1, question: "How does the color palette generator work?" },
    {
      id: 2,
      question: "Does the color palette generator offer accessibility tools?",
    },
    {
      id: 3,
      question: "Does the color palette generator offer accessibility tools?",
    },
    { id: 4, question: "How does the color palette generator work?" },
    {
      id: 5,
      question: "Does the color palette generator offer accessibility tools?",
    },
    {
      id: 6,
      question: "Does the color palette generator offer accessibility tools?",
    },
  ];

  return (
    <div className="flex flex-row items-start px-20 py-18 gap-[284px] bg-(--nav-sidebar-bg)">
      <div className="flex-none">
        <h1 className="font-inter font-normal text-[56px] leading-[68px] text-(--global-black)">
          FAQs
        </h1>
      </div>

      <div className="flex flex-col items-start gap-18 flex-1">
        {faqItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center w-full gap-[17px]"
          >
            <div className="flex flex-row items-start justify-between w-full cursor-pointer">
              <p className="font-inter font-medium text-2xl leading-[29px] text-(--grey-7)">
                {item.question}
              </p>
              <div className="flex-none pr-[26.5px]">
                <img
                  src="/svg/plus-black.svg"
                  alt=""
                  className="w-[14px] h-[15.9px]"
                />
              </div>
            </div>
            <div className="w-full h-0 border-t border-(--global-black)" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;

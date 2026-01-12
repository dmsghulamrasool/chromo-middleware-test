import ColorPalettes from "./color-palettes";
import Footer from "./footer";
import UploadSection from "./upload";
import GenerateSection from "./generate";
import FAQSection from "./faq";
import FeaturesSection from "./features";
import PricingSection from "./pricing";
import CtaSection from "./cta-section";

const HomePage = () => {
  return (
    <div className="flex flex-col justify-center w-full min-h-screen ">
      <FeaturesSection />

      <UploadSection />
      <GenerateSection />

      <PricingSection />

      <FAQSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default HomePage;

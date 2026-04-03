import ContactUs from "../../components/sections/ContactUs";
import FamilyOwned from "./(landingPage)/FamilyOwned";
import LandingPageCarousel from "./(landingPage)/LandingPageCarousel";
import NewsArticles from "./(landingPage)/NewsArticles";
import RequestQuote from "./(landingPage)/RequestQuote";

export default function HomePage() {
  return (
    <>
      <LandingPageCarousel />
      <FamilyOwned />
      <RequestQuote />
      {/* <GovAgencies /> */}
      <NewsArticles />
      {/* <WeSpecialize /> */}
      <ContactUs />
    </>
  );
}

import ContactUs from "../../components/sections/ContactUs";
import FamilyOwned from "./(landingPage)/FamilyOwned";
import LandingPageCarousel2 from "./(landingPage)/LandingPageCarousel2";
import NewsArticles from "./(landingPage)/NewsArticles";
import RequestQuote from "./(landingPage)/RequestQuote";

export default function HomePage() {
  return (
    <>
      <LandingPageCarousel2 />
      <FamilyOwned />
      <RequestQuote />
      {/* <GovAgencies /> */}
      <NewsArticles />
      {/* <WeSpecialize /> */}
      <ContactUs />
    </>
  );
}

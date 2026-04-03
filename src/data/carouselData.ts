// ─────────────────────────────────────────────────────────────────────────────
// Carousel & Landing Page Content
// Slide data for the homepage hero carousel, "Request a Quote" cards,
// how-to steps, and news articles displayed on the landing page.
// ─────────────────────────────────────────────────────────────────────────────

export const LandingPageCarouselData = [
  {
    header: "Hello!",
    subheader: "We are",
    description:
      "We are a collection of companies here to service your construction needs. Click the arrow for more details.",
    buttons: [
      {
        variant: "carouselPrimary",
        text: "View All Materials",
        navigateTo: "/materials",
      },
      {
        variant: "carouselOutline",
        text: "Contact Us",
        navigateTo: "/contact",
      },
    ],
    image: null,
  },
  {
    logo: "/logo_stoneyard.svg",
    logoAlt: "Stoneyard Logo",
    subheader: "Stoneyard",
    description:
      "We specialize in providing natural stone products for construction and landscaping purposes. Our stone may be used in various applications like building facades, countertops, and retaining walls. Our high quality natural stone products can enhance any project design.",
    buttons: [
      {
        text: "View Materials",
        navigateTo: "/materials",
        filter: ["Stoneyard"],
      },
    ],
    image: "/image_carousel_stoneyard.png",
    alt: "Variety of natural stone products at Stoneyard, used for construction and landscaping projects",
  },
  {
    logo: "/logo_mrc.svg",
    logoAlt: "MRC Rock & Sand logo",
    subheader: "MRC Rock & Sand",
    description: "Supplying aggregates and services for construction",
    buttons: [
      {
        text: "View Materials",
        navigateTo: "/materials",
        filter: ["MRC Rock & Sand"],
      },
      {
        text: "View Services",
        navigateTo: "/services#MRC",
      },
    ],
    image: "/about_us_timeline.png",
    alt: "MRC Rock & Sand supplying aggregates and construction services.",
  },
  {
    logo: "/logo_spm.svg",
    altLogo: "SPM Santa Paula Materials logo",
    subheader: "Santa Paula Materials",
    description: "Recycling and producing crushed materials",
    buttons: [
      {
        text: "View Materials",
        navigateTo: "/materials",
        filter: ["Santa Paula Materials"],
      },
      {
        text: "View Services",
        navigateTo: "/services#SPM",
      },
    ],
    image: "/image_carousel_spm.png",
    alt: "Santa Paula Materials (SPM) recycling and producing crushed materials",
  },
];

export const RequestQuoteCards = [
  {
    image: "/quote_add_material.svg",
    title: "Add Material",
    text: "From Material MaterialDetailForm, enter the quantity, and click on the 'request to Quote.'",
    width: 125,
    height: 125,
  },
  {
    image: "/quote_review_cart.svg",
    title: "Review Cart",
    text: "Click on the cart icon at the navigation bar to review materials in your cart.",
    width: 125,
    height: 127,
  },
  {
    image: "/enter_info.svg",
    title: "Enter Info",
    text: "Enter your contact info, and a message specifying your purpose.",
    width: 125,
    height: 132,
  },
  {
    image: "/review.svg",
    title: "We Review",
    text: "We will review your request and contact you directly with a quote.",
    width: 125,
    height: 132,
  },
];

export const HOWTOUSE = [
  {
    title: "1. Add Material to Cart",
    content:
      "From Material Description, enter the quantity, and click on the  'Request to Quote.'",
  },
  {
    title: "2. Review Cart",
    content:
      "Click on the cart icon at the navigation bar to review all materials in your cart.",
  },
  {
    title: "3. Enter Contact Info",
    content:
      "Enter your contact info, and a message to MRC specifying the purpose for the materials.",
  },
  {
    title: "4. Reviewed by MRC",
    content:
      "MRC will review your request and contact you directly with a quote.",
  },
];

export const Articles = [
  {
    image: "/article1.png",
    alt: "Croatian father and son duo behind Santa Paula Materials, awarded for their family-owned business and immigrant roots.",
    title: "Spirit of Small Business 2016 honoree, Santa Paula Materials",
    content:
      "As a young boy in the lush seaside municipality of pre blocka Croatia Mile once dreamed of captaining his own ship. Yet due to the restraints of the socialist Federal... ",
    url: "https://www.youtube.com/watch?v=zYtb3uYsGnU",
    button: "Watch Video",
  },
  {
    image: "/article2b.jpg",
    alt: "Santa Paula Materials (SPM) assisting in the Montecito mudslide cleanup by collecting rocks and construction debris.",
    title: "As Montecito cleanup continues, a search for...",
    content:
      "Santa Paula Materials, which sells rocks and recycled construction debris, will collect the rocks that are hauled out, while Standard Industries, a building material...",
    url: "https://www.latimes.com/local/lanow/la-me-ln-montecito-mud-20180117-story.html#:~:text=Santa%20Paula%20Materials%2C%20which%20sells%20rocks%20and,the%20California%20Department%20of%20Resources%20Recycling%20and",
    button: "Read Article",
  },
  {
    image: "/article3.png",
    alt: "Ceremonial check presentation to Santa Paula Materials (SPM) for a $1.1M state loan supporting new green recycling initiatives.",
    title: "SP Materials: State $1.1M loan to help create new...",
    content:
      'The ceremonial check for the proposed expansion - considered in the category of "green" business practices - was presented Thursday to Santa Paula Materials\'...',
    url: "https://santapaulatimes.com/news/archivestory.php/aid/26736/SP_Materials:_State_$1.1M_loan_to_help_create_new_recycling_business.html",
    button: "Read Article",
  },
];

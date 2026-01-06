export const LandingPageCarousel = [
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

export const ServicesSPM = [
  {
    id: 1,
    image: "/Service Image.png",
    name: "Recycle Building Material",
    desc: "We take pride in our recycling efforts, which are a key part of our commitment to sustainability. We process a variety of construction and demolition debris, transforming waste materials like concrete, asphalt, and other aggregates into high-quality recycled products. Our recycling services help clients minimize their environmental impact while providing them with reliable materials for their projects. ",
  },
];

export const ServicesMRC = [
  // {
  //   id: 1,
  //   image: "/C & D Demolition.png",
  //   // image: "/image 136.svg",
  //   name: "C & D Demolition",
  //   desc: "We offer comprehensive construction and demolition (C&D) services that focus on efficient site clean-up and material recovery. Our team specializes in safely dismantling structures and managing the debris generated from these projects. We prioritize recycling and reclaiming valuable materials. We’re committed to providing a smooth, efficient experience for our clients while promoting sustainability.",
  // },
  {
    id: 2,
    image: "/RockReclamation.png",
    name: "Rock Reclamation",
    desc: "We specialize in rock reclamation, a process that allows us to recover and repurpose valuable materials from construction and demolition sites. We take great care to sort and process various types of rock and aggregate, transforming them into usable products for future projects. This not only helps reduce waste in landfills but also conserves natural resources, making it a sustainable choice for our clients.",
  },
  {
    id: 3,
    image: "/Crushing&Screening.png",
    name: "Crushing & Screening",
    desc: "We provide comprehensive crushing and screening services that are essential for processing raw materials efficiently. Our mobile units can be transported directly to your project site, allowing us to deliver onsite services tailored to your needs. During the crushing process, we break down large materials into smaller, manageable pieces. Then, through screening, we separate these materials into various sizes and grades. We’re dedicated to helping you achieve the best results while minimizing waste and maximizing productivity.",
  },
];

export const CompanyAddresses = [
  {
    id: 1,
    name: "Santa Paula Materials",
    address: "1224 E Santa Clara St, Santa Paula, CA 93060",
    maps: "https://maps.app.goo.gl/auXAbfWyM3472uwb6",
  },
  {
    id: 2,
    name: "Stoneyard",
    address: "1580 E Lemonwood Dr, Santa Paula, CA 93060",
    maps: "https://maps.app.goo.gl/6U3rWgLghiJeLMtF9",
  },
  {
    id: 3,
    name: "MRC Rock & Sand (Mojave)",
    address: "Mojave, CA 93501",
    maps: "https://maps.app.goo.gl/Xr5dtssB8uk2qSQi9",
  },
  {
    id: 4,
    name: "MRC Rock & Sand (Ojai)",
    address: "Ojai, CA 93023",
    maps: "https://maps.app.goo.gl/3vTg68e313t97rjB6",
  },
  {
    id: 5,
    name: "MRC Rock & Sand (Fillmore)",
    address: "Fillmore, CA 93015",
    maps: "https://maps.app.goo.gl/7LDDrX1aKRdLyGdn9",
  },
];

export const HISTORY = [
  {
    id: "SantaPaulaMaterials",
    block: "We started as,",
    title: "Santa Paula Materials",
    body: "Santa Paula Materials specializes in delivering high-quality aggregate products for construction and landscaping. We provide a wide range of materials, including rock, sand, gravel, and landscaping supplies. Additionally, we offer recycling and delivery services tailored to both residential and commercial projects. Our commitment to sustainability ensures a reliable supply that meets our customers' needs.",
    image: "/image_carousel_spm.png",
  },
  {
    id: "MRC",

    block: "We added,",
    title: "MRC Rock & Sand",
    body: "MRC Rock and Sand is a general contracting company providing on-site  screening and crushing services. We have collaborated with land developers, gold mines, and county maintenance projects, delivering tailored solutions to meet their unique needs. We offer specialized services that include custom blending and aggregate processing.",
    image: "/about_us_timeline.png",
  },
  {
    id: "Stoneyard",
    block: "Lastly, we added",
    title: "Stoneyard",
    body: "At Stoneyard, we offer an extensive range of natural stone products for both residential and commercial projects. We provide materials for hardscaping, such as patios, walkways, and walls, as well as interior applications like fireplaces and countertops. Additionally, we offer custom stonework and consultation services to help you achieve the perfect look and functionality for your project. ",
    image: "/image_carousel_stoneyard.png",
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

export const MaterialsMenu = [
  {
    company: "Stoneyard",
    text: "We are focused on artisanal stone and tile.",
  },
  {
    company: "MRC Rock & Sand",
    text: "We are focused on artisanal stone and tile.",
  },
  {
    company: "Santa Paula Materials",
    text: "We are focused on artisanal stone and tile.",
  },
];

export const ArtisanalStone = [
  "Oklahoma Flagstone",
  "Arizona Flagstone",
  "Pennsylvania Blue",
  "Sydney Peak",
  "Santa Barbara Sandstone",
  "Silver & Gold Quartzite",
  "Lompoc Stone",
  "Pacific Clay Brick",
  "Pebbles",
];

export const MRCandSPMMaterials = [
  "Mojave",
  "Sespe",
  "Malibu",
  "Cucamonga",
  "Ojai",
  "Topanga",
  "Santa Barbara",
  "Construction Aggregates",
];

export const SantaPaulaMaterials = ["Construction Aggregates"];

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
      "The ceremonial check for the proposed expansion - considered in the category of “green” business practices - was presented Thursday to Santa Paula Materials’...",
    url: "https://santapaulatimes.com/news/archivestory.php/aid/26736/SP_Materials:_State_$1.1M_loan_to_help_create_new_recycling_business.html",
    button: "Read Article",
  },
];

export const AllCompanies = [
  "MRC Rock & Sand",
  "Santa Paula Materials",
  "Stoneyard",
];

export const AllCategories = [
  "Aggregate",
  "Base Materials",
  "Boulders",
  "Cobble",
  "Decomposed Granite Options",
  "Drain Rock",
  "Engineered Fill",
  "Fill Dirt",
  "Fill Sand",
  "Natural Gravel",
  "Rip Rap",
  "Rock Dust",
  "Top Soil",
];

export const AllTextures = ["Angular", "Round"];

export const AllColors = [
  "Gold",
  "Red/Pink",
  "Blue",
  "Green",
  "White/Cool Neutral",
  "Earth-tones",
  "Gray/Black",
  "Tropico",
];

export const AllSizes = [
  '1/4" chip',
  '1/4" minus',
  '3/8" - 1/2"',
  '3/4"',
  '1 - 1/2"',
  '3/8"',
  '3/4" - 1"',
  '1" - 2"',
  '1" - 4"',
  '2" - 4"',
  '4" - 8"',
  '4" - 12"',
  '6"',
  '12"',
  '18"',
  '24"',
  '30"',
  '36"',
  '42"',
  '48"',
  '54"',
  '60"',
  "1' - 2'",
  "2' - 3'",
  "3' - 4'",
  "4' - 6'",
  "+6'",
  "Class II Base",
  "CMB",
  "CAB",
  "Fill Sand",
  "Fill Dirt",
  "Engineered Fill",
];

export const MaterialID = [
  { id: 1, name: "Mojave" },
  { id: 2, name: "Sespe" },
  { id: 3, name: "Malibu" },
  { id: 4, name: "Cucamonga" },
  { id: 5, name: "Ojai" },
  { id: 6, name: "Topanga" },
  { id: 7, name: "Santa Barbara" },
  { id: 8, name: "Construction Aggregates" },
  { id: 9, name: "Oklahoma Flagstone" },
  { id: 10, name: "Arizona Flagstone" },
  { id: 12, name: "Sydney Peak" },
  { id: 13, name: "Santa Barbara Sandstone" },
  { id: 20, name: "Silver & Gold Quartzite" },
  { id: 21, name: "Pennsylvania Blue" },
  { id: 22, name: "Lompoc Stone" },
  { id: 23, name: "Pacific Clay Brick" },
  { id: 27, name: "Belgard Pavers" },
  { id: 28, name: "Pebbles" },
];

export const ContactInfo = [
  {
    company: "MRC Rock & Sand",
    phoneNumber: "(805) 524-5569",
    email: "info@mrcrs.com",
  },
  {
    company: "Santa Paula Materials",
    phoneNumber: "(805) 525-6858",
    email: "info@santapaulamaterials.com",
  },
  {
    company: "Stoneyard",
    phoneNumber: "(805) 962-9511",
    email: "stoneyardsp@gmail.com",
  },
];

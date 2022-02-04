import styles from "./styles/App.css";
import { StaticScreen, DynamicScreen } from "./screen";
import { FaGithubSquare } from "react-icons/fa";
import { AiFillGoogleSquare } from "react-icons/ai";
import shoeGif from "./img/shoe.gif";
import ibsLogo from "./img/data_science_small_logo.png";

const title = (
  <div className="titleContainer">
    <div className="titleUpper">
      <span>22 Years of</span>
    </div>
    <div className="titleLower">
      <span>Sneak</span>
      <img className="titleGif" src={shoeGif} />
      <span>rs</span>
    </div>
  </div>
);

const subtitle = (
  <>
    <span className="subtitle">
      Web data and computational models can play an important role in analyzing
      cultural trends. The current study uses <b>23,492</b> sneaker product
      images and meta information collected from a global reselling shop,
      StockX.com. We construct an index named sneaker design index that
      summarizes the design characteristics of sneakers using a{" "}
      <b>contrastive learning</b> method. This index allows us to study changes
      in design over a 22 year-long period (1999-2020).
    </span>
    <span className="subtitle">
      original paper: <a>link</a>
      <br />
      project's github: <a>link</a>
    </span>
  </>
);

const Section = ({ header, contents }) => {
  let contentList = contents.map((content) => (
    <span key={content} className="section-content">
      &emsp;{content}
    </span>
  ));
  return (
    <div className="section">
      <span className="section-header">{header}</span>
      {contentList}
    </div>
  );
};

const footer = (
  <div className="footerContainer">
    <span className="credit">
      <b>Main Author</b>: Sungkyu Shaun Park (박성규), Ph.D.
    </span>
    <span className="credit">
      <b>Data Visualizer</b>: Nguyen Minh Hieu
      <FaGithubSquare />
      <AiFillGoogleSquare />
    </span>
    <img
      src={ibsLogo}
      className="footerLogo"
      onClick={() => window.open("https://ds.ibs.re.kr/")}
    />
  </div>
);

const text = [
  {
    h: "Background",
    c: [
      "The online reselling market is proliferating. One of the fastest- growing sectors is fashion , as noted by Anne-Marie Tomchak, a former Vogue digital director, “there are literally tens of millions of pounds worth of clothes sitting dormant in people’s wardrobes.” Many reselling markets like eBay, Depop, Vinted, and Etsy count tens of millions of users, turning themselves into excellent plat- forms for trading fashion items. Data accumulated within these sites provide a unique opportunity to study how fashion trend has evolved (or sometimes revolved) over a longitudinal period.",
      "With the use of 22-year spanning Web data, the current research makes the following observations and contributions: 1) Based on feature engineering, we find temporal patterns in design change, e.g., sneakers tend to be more pastel-toned and brighter over time; 2) We present a novel neural-net based embedding jointly considering color and shape information from the given sneaker images; 3) The proposed embedding can infer key cultural trends of sneakers including the product category, target consumer, and high premium in the reselling market; 4) Based on the extracted latent representation, we find that the major sneaker brands follow similar patterns for color whereas they cling to their design patterns for shape over two decades. To the best of our knowledge, these patterns observed via large-scale Web data have never been studied before.",
    ],
  },
  {
    h: "Temporal Patterns",
    c: [
      "The extracted embedding allows us to explore temporal changes in designs over a particular subset of data, such as brands, product categories, or specific features. For visual comprehensiveness, we further use PACMAP to reduce the dimension from 128 dimensions to 3 dimensions as shown in the interactive plot below.",
    ],
  },
  {
    h: "Neural Network based Embedding",
    c: [
      "Here, we present our neural network based embedding which can be seen intuitively pull shoes with similar colors together while push opposing color ones away",
    ],
  },
  {
    h: "Conclusion",
    c: [
      "The current study presented an unsupervised neural embedding model of a mass fashion item mined from the Web. We jointly utilized the color and shape information to embed sneaker designs from an extensive collection of Web images. This process required no label information at all, and the training was done end-to-end. By further reducing the data dimensions, we proposed the Sneaker Design Index that is an intuitive method to track design changes over time and across brands. Our data analysis revealed patterns of convergence and uniqueness in the design of major sneaker design houses over two decades. "
    ],
  },
];

export default function App() {
  return (
    <div className="container">
      {title}
      {subtitle}
      <Section header={text[0].h} contents={text[0].c} />
      <Section header={text[2].h} contents={text[2].c} />
      <StaticScreen />
      <Section header={text[1].h} contents={text[1].c} />
      <DynamicScreen />
      <Section header={text[3].h} contents={text[3].c} />
      {footer}
    </div>
  );
}

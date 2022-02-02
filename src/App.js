import styles from './styles/App.css'
import { StaticScreen, DynamicScreen } from './screen'
import {
	FaGithubSquare,
} from 'react-icons/fa'
import { AiFillGoogleSquare } from 'react-icons/ai'
import shoeGif from './img/shoe.gif'
import ibsLogo from './img/data_science_small_logo.png'

const title =
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
	
const subtitle =
	<>
		<span className="subtitle">
			Web data and computational models can play an important role in analyzing cultural trends. The current study uses <b>23,492</b> sneaker product images and meta information collected from a global reselling shop, StockX.com. We construct an index named sneaker design index that summarizes the design characteristics of sneakers using a <b>contrastive learning</b> method. This index allows us to study changes in design over a 22 year-long period (1999-2020).
		</span>
		<span className="subtitle">
			original paper: <a>link</a>
			<br />
			project's github: <a>link</a>
		</span>
	</>

const Section = ({header, contents}) => {
	let contentList = contents.map((content) => (
		<span key={content} className="section-content">
			&emsp;{content}
		</span>
	))
	return (
		<div className="section">
			<span className="section-header">
				{header}
			</span>
			{contentList}
		</div>
	)
}

const footer =
	<div className="footerContainer">
		<span className="credit"><b>Main Author</b>: Sungkyu Shaun Park (박성규), Ph.D.</span>
		<span className="credit">
			<b>Data Visualizer</b>: Nguyen Minh Hieu   
			<FaGithubSquare /> 
			<AiFillGoogleSquare />
		</span>
		<img src={ibsLogo} className="footerLogo" onClick={()=> window.open("https://ds.ibs.re.kr/")}/>
	</div>

const text1 = [
	{ 
		h: "Background",
		c: [
			"The online reselling market is proliferating. One of the fastest- growing sectors is fashion , as noted by Anne-Marie Tomchak, a former Vogue digital director, “there are literally tens of millions of pounds worth of clothes sitting dormant in people’s wardrobes.” Many reselling markets like eBay, Depop, Vinted, and Etsy count tens of millions of users, turning themselves into excellent plat- forms for trading fashion items. Data accumulated within these sites provide a unique opportunity to study how fashion trend has evolved (or sometimes revolved) over a longitudinal period.",
			"With the use of 22-year spanning Web data, the current research makes the following observations and contributions: 1) Based on feature engineering, we find temporal patterns in design change, e.g., sneakers tend to be more pastel-toned and brighter over time; 2) We present a novel neural-net based embedding jointly considering color and shape information from the given sneaker images; 3) The proposed embedding can infer key cultural trends of sneakers including the product category, target consumer, and high premium in the reselling market; 4) Based on the extracted latent representation, we find that the major sneaker brands follow similar patterns for color whereas they cling to their design patterns for shape over two decades. To the best of our knowledge, these patterns observed via large-scale Web data have never been studied before."
		]
	},
	{
		h: "Exploring Sneaker Color trend in 3D",
		c: [
			"Data suggest that sneakers tend to employ brighter colors and lower hue and saturation values over time. Yet, each brand continues to build toward its particular trajectory of shape-related design patterns. The embedding analysis also predicts which sneakers will likely see a high premium in the reselling market, suggesting a viable algorithm-driven investment and design strategies. The current work is the first to apply data science methods to a new research domain — i.e., analysis of product design evolution over a long his- torical period — and has implications for the novel use of Web data to understand cultural patterns that are otherwise hard to obtain."
		]
	}
]

export default function App() {
  return (
    <div className="container">
			{title}
			{subtitle}
			<Section header={text1[0].h} contents={text1[0].c}/>
      <StaticScreen />
			<Section header={text1[0].h} contents={text1[0].c}/>
			<DynamicScreen />
			{footer}
    </div>
  )
}

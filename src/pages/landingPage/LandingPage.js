import React, {useState} from "react";
import { Redirect } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './LandingPage.css';
import Header from '../../components/header/Header'
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

//might make into state
let redirectPage;

function LandingPage() {
	const [currSlide, setCurrSlide] = useState(0);
	const [redirect, setRedirect] = useState(false);
	const settings = {
		dots: true,
		fade: true,
		infinite: true,
		speed: 800,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true,
		afterChange: current => setCurrSlide(current),
		// autoplay: true,
	};

	const theme = createMuiTheme({
	  palette: {
	    type: 'dark',
	  },
	});
	
	//This is what I did to make slides anchor to the corresponding page 
	const goToPage = () => {
		setRedirect(true);
		switch(currSlide) {
			case 0:
				redirectPage = '/mainMarket';
				break;
			case 1:
				redirectPage = '/auxMarket';
				break;
			default:
				redirectPage = '/';
				break;
		}
	}

	if (redirect) {
		return <Redirect push to={redirectPage} />;
	} else {

	return(
		<ThemeProvider theme={theme}>
			<div className={'hero-image'}>
				<Header transparent={true}/>
				<div className={'landing-pg-carousel'}>
					<Slider {...settings}>	
						<div className='carousel-text'>
							<h2>Main Market</h2>
							<p>make 5% on auxilliary market fees</p>
						</div>
						<div className='carousel-text' onClick={goToPage}>
							<h2>Auxiliary Markets</h2>
							<p>own Auxiliary token and watch your investment grow</p>
						</div>
					</Slider>
				</div>
			</div>
		</ThemeProvider>
		);
	}

}

export default LandingPage;
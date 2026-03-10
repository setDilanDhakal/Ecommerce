import Navigation from "../components/Navigation.jsx";
import Slider from "../components/Slider.jsx";
import Footer from '../components/Footer.jsx'
import Hero from "../components/Hero.jsx";
import Card from '../components/Card.jsx'
import Slide from "../components/Slide.jsx";
function Home() {
  return (
    <div className="">
      <Slider />
      <Hero />
      <Slide />
      <Card />
      <Footer />

    </div>
  );
}

export default Home;

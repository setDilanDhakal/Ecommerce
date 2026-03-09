import Navigation from "../components/Navigation.jsx";
import Slider from '../components/Slider.jsx'
import Hero from "../components/Hero.jsx";
import Slide from "../components/Slide.jsx";
function Home() {
  return (
    <div className="">

        <Slider />
      <div className="px-8">
                <Hero />
        <Navigation />

        <Hero />
        <Slide />
      </div>
    </div>
  );
}

export default Home;

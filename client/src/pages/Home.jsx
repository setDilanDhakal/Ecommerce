import Slider from "../components/Slider.jsx";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import Slide from "../components/Slide.jsx";
import Banner from "../components/Banner.jsx";
import Testimonial from "../components/Testimonial.jsx";

function Home() {


  return (
    <div className="bg-neutral-950 text-white">
      <Slider />
      <Hero />
      <Slide />
      <Card />
      <Banner />
      <Testimonial />
    </div>
  );
}

export default Home;

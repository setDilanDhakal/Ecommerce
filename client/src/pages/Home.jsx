import Navigation from "../components/Navigation.jsx";
import Slider from "../components/Slider.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import Slide from "../components/Slide.jsx";
import Banner from "../components/Banner.jsx";
import { useEffect, useRef } from "react";

function Home() {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal, .reveal-scale");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div ref={rootRef}>
      <div className="reveal-scale"><Slider /></div>
      <div className="reveal"><Hero /></div>
      <div className="reveal"><Slide /></div>
      <div className="reveal"><Card /></div>
      <div className="reveal"><Banner /></div>



      <div className="reveal"><Footer /></div>
    </div>
  );
}

export default Home;

// src/Pages/HomePage.js


import Hero from '../../Compenents/HeroSection/Hero';
import Hotels from '../../Compenents/HeroSection/Hotels';
import Newsletter from '../../Compenents/HeroSection/NewsLetter';
import Offers from '../../Compenents/HeroSection/Offers';
import Testimonials from '../../Compenents/HeroSection/Testimonials';

function Home() {
  return (
    <div>
      <Hero />
      <Hotels />
      <Offers />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

export default Home;

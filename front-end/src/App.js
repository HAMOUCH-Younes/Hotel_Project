
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


import FeaturedDestinations from './Pages/Hotels';
import HeroSection from './Pages/HeroSection';

function App() {
  return (
    <div>
      <HeroSection />
      <FeaturedDestinations />
    </div>
  );
}

export default App;

// App.js
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './Pages/HomePage/Home';
import HotelCard from './Pages/HotelsRoom/Rooms';
import Footer from './Compenents/Footer/Footer';
import Navbar from './Compenents/Navbar/Navbar';
import Booking from './Pages/BookPage/Booking';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import FeedbackForm from './Pages/Feedback/Feedback';
import ProfileInfo from './Pages/Profile/Profile';
import EditProfile from './Pages/Profile/EditeProfile/EditeProfile';
import ContactForm from './Pages/Contact/Contact';
import Activitie from './Pages/Activitie/Activitie';
import Dashboard from './Admin/AdminDashbord/Dashbord';
import Settings from './Pages/Profile/Settings/Settings';
import Hotels from './Admin/Tables/Hotels/Hotels';
import Rooms from './Admin/Tables/Rooms/Rooms';
import Bookings from './Admin/Tables/Bookings/Bookings';
import Users from './Admin/Tables/Users/Users';
import EditBooking from './Admin/Tables/Bookings/EditBooking';
import ListOffers from './Admin/Offers/ListOffers';
import AddOffer from './Admin/Offers/AddOffer';

function App() {
  const location = useLocation();

  // Define routes where Navbar and Footer should be hidden
  const hideLayout = ['/login', '/signup','/profile/edit','/contact','/profile/settings'].includes(location.pathname) || location.pathname.startsWith('/admin');


  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<HotelCard />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/commentaire" element={<FeedbackForm />} />
        <Route path="/profile" element={<ProfileInfo />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/activitie" element={<Activitie />} />
        <Route path="/admin" element={<Dashboard />} />
         <Route path="/profile/settings" element={<Settings />} />

         <Route path="/admin/hotels" element={<Hotels />} />
         <Route path="/admin/rooms" element={<Rooms />} />
         <Route path="/admin/bookings" element={<Bookings />} />
         
        <Route path="/admin/bookings/edit/:id" element={<EditBooking />} />



         <Route path="/admin/users" element={<Users />} />
         <Route path="/admin/add-offers" element={<AddOffer/>} />
         <Route path="/admin/offers" element={<ListOffers />} />
         
         

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;

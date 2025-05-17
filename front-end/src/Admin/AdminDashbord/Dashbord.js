import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaDollarSign, FaUsers, FaUserPlus, FaShoppingCart } from 'react-icons/fa';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Carousel } from 'react-bootstrap';

// Sidebar + Layout component
const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#f8f9fa' }}>
      {/* Teal background spanning the entire page, now fixed */}
      <div
        style={{
          backgroundColor: '#2dcecc',
          height: '250px',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          borderRadius: '0 0 1rem 1rem',
        }}
      ></div>

      {/* Sidebar fixed on left */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '250px',
          height: 'calc(100vh - 40px)',
          marginTop: '20px',
          marginLeft: '20px',
          backgroundColor: '#fff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          padding: '1.5rem 1rem',
          color: '#344767',
          fontFamily: "'Poppins', sans-serif'",
          zIndex: 1000,
          borderTopLeftRadius: '1rem',
          borderBottomLeftRadius: '1rem',
        }}
      >
        <div className="mb-4">
          <img
            src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/argon-logo.png"
            alt="Argon Dashboard 2 PRO"
            style={{ width: '120px' }}
          />
        </div>
        <ul className="list-unstyled">
          <li className="mb-3">
            <a href="#dashboard" className="text-decoration-none text-primary fw-bold">
              <i className="fas fa-tachometer-alt me-2"></i>Dashboard
            </a>
          </li>
          <li className="mb-3">
            <a href="#tables" className="text-decoration-none text-dark">
              <i className="fas fa-table me-2"></i>Tables
            </a>
          </li>
          <li className="mb-3">
            <a href="#billing" className="text-decoration-none text-dark">
              <i className="fas fa-receipt me-2"></i>Billing
            </a>
          </li>
          <li className="mb-3">
            <a href="#vr" className="text-decoration-none text-dark">
              <i className="fas fa-vr-cardboard me-2"></i>Virtual Reality
            </a>
          </li>
          <li className="mb-3">
            <a href="#rtl" className="text-decoration-none text-dark">
              <i className="fas fa-globe me-2"></i>RTL
            </a>
          </li>
          <li className="small text-muted mt-4">ACCOUNT PAGES</li>
          <li className="mb-2">
            <a href="#profile" className="text-decoration-none text-dark">
              <i className="fas fa-user me-2"></i>Profile
            </a>
          </li>
          <li>
            <a href="#signin" className="text-decoration-none text-dark">
              <i className="fas fa-sign-in-alt me-2"></i>Sign In
            </a>
          </li>
        </ul>
      </aside>

      {/* Main content with padding left to avoid sidebar */}
      <main style={{ paddingLeft: '290px', paddingTop: '40px', paddingRight: '20px', position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
};

// SalesOverview component with animation
const data = [
  { name: 'Apr', sales: 300 },
  { name: 'May', sales: 400 },
  { name: 'Jun', sales: 500 },
  { name: 'Jul', sales: 600 },
  { name: 'Aug', sales: 700 },
  { name: 'Sep', sales: 650 },
  { name: 'Oct', sales: 800 },
  { name: 'Nov', sales: 750 },
  { name: 'Dec', sales: 900 },
];

const SalesOverview = () => {
  const [animatedData, setAnimatedData] = React.useState([]);

  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= data.length) {
        setAnimatedData(data.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className="mb-4 shadow-sm"
      style={{ borderRadius: '1rem', overflow: 'hidden', height: '350px' }} // Increased height
    >
      <Card.Body>
        <h5 className="text-muted mb-3">Sales Overview</h5> {/* Increased font size */}
        <small className="text-success mb-3 d-block">↑ 4% more in 2022</small>
        <ResponsiveContainer width="100%" height={250}> {/* Increased height */}
          <AreaChart data={animatedData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#17c1e8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#17c1e8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 14 }} // Increased font size
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 14 }} // Increased font size
              domain={[0, 1000]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '0.5rem', border: 'none' }}
              itemStyle={{ color: '#fff', fontSize: 14 }} // Increased font size
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#17c1e8"
              strokeWidth={3} // Increased stroke width
              fillOpacity={1}
              fill="url(#colorSales)"
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

// Promo component with Carousel
const slides = [
  {
    title: 'Faster way to create web pages',
    description:
      "That's my skill. I'm not really specially talented at anything except for the ability to learn.",
    image:
      'https://media.istockphoto.com/id/2125930371/fr/photo/waves-of-particles.webp?a=1&b=1&s=612x612&w=0&k=20&c=3svnItoCW9us58vtLcIgiq-IqkgsCup1isy14dOWQco=',
  },
  {
    title: 'Design with Purpose',
    description: 'Start from an idea and shape it into a clean, modern UI.',
    image:
      'https://plus.unsplash.com/premium_photo-1687686677659-8c31848a69cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzaWduJTJDY3JlYXRpdmV8ZW58MHx8MHx8fDA=',
  },
  {
    title: 'Code Smart, Build Fast',
    description: 'Use tools that empower you to focus on logic, not boilerplate.',
    image:
      'https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvZGluZyUyQ2RldmVsb3BlcnxlbnwwfHwwfHx8MA==',
  },
  {
    title: 'Deploy with Confidence',
    description: 'Ship faster with stable, scalable setups.',
    image:
      'https://media.istockphoto.com/id/941594596/fr/photo/le-cloud-computing-avec-pluie-code-machine.webp?a=1&b=1&s=612x612&w=0&k=20&c=mE1XJgAeFWhX5HJP45u37H0g_xQPM_XZ-PQLWSNGAz4=',
  },
];

const Promo = () => {
  return (
    <Card
      className="shadow-sm"
      style={{ borderRadius: '1rem', overflow: 'hidden', height: '350px', position: 'relative' }} // Increased height
    >
      <Carousel
        controls
        indicators={false}
        fade
        interval={5000}
        prevLabel=""
        nextLabel=""
        className="h-100"
        style={{ width: '100%', height: '100%' }}
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index} style={{ height: '100%' }}>
            <div
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '2rem', // Increased padding
                color: '#fff',
              }}
            >
              <div style={{ maxWidth: '70%' }}>
                <h4 className="fw-bold mb-3">{slide.title}</h4> {/* Increased font size */}
                <p className="lead">{slide.description}</p> {/* Increased font size */}
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <style>{`
        .carousel-control-prev, .carousel-control-next {
          top: 50%;
          transform: translateY(-50%);
          width: 2.5rem; // Slightly increased size
          height: 2.5rem; // Slightly increased size
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .carousel-control-prev {
          left: 1rem;
        }
        .carousel-control-next {
          right: 1rem;
        }
        .carousel-control-prev:hover, .carousel-control-next:hover {
          opacity: 1;
        }
        .carousel-control-prev-icon, .carousel-control-next-icon {
          filter: invert(1);
          width: 1.2rem; // Slightly increased size
          height: 1.2rem; // Slightly increased size
        }
      `}</style>
    </Card>
  );
};

// Dashboard component
const Dashboard = () => {
  return (
    <Layout>
      {/* Content wrapper with added top margin */}
      <div style={{ marginTop: '30px', position: 'relative', zIndex: 2 }}>
        {/* Top Cards */}
        <Row className="g-4 mb-5"> {/* Increased gutter and margin-bottom */}
          <Col md={3}>
            <Card
              className="p-4 shadow-sm" // Increased padding
              style={{
                backgroundColor: '#11cdef',
                borderRadius: '1.2rem', // Slightly increased radius
                color: '#fff',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50">TODAY'S MONEY</small>
                  <h3 className="mb-0 mt-2">{/* Increased font size */}$53,000</h3>
                  <small className="text-success">+55% since yesterday</small>
                </div>
                <FaDollarSign size={28} /> {/* Increased icon size */}
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                backgroundColor: '#2dcecc',
                borderRadius: '1.2rem',
                color: '#fff',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50">TODAY'S USERS</small>
                  <h3 className="mb-0 mt-2">2,300</h3>
                  <small className="text-success">+3% since last week</small>
                </div>
                <FaUsers size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                backgroundColor: '#fb6340',
                borderRadius: '1.2rem',
                color: '#fff',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50">NEW CLIENTS</small>
                  <h3 className="mb-0 mt-2">+3,462</h3>
                  <small className="text-danger">-2% since last quarter</small>
                </div>
                <FaUserPlus size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                backgroundColor: '#f7b731',
                borderRadius: '1.2rem',
                color: '#fff',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-white-50">SALES</small>
                  <h3 className="mb-0 mt-2">$103,430</h3>
                  <small className="text-success">+5% than last month</small>
                </div>
                <FaShoppingCart size={28} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Graph + Promo */}
        <Row className="g-4">
          <Col md={7}> {/* Increased width slightly */}
            <SalesOverview />
          </Col>
          <Col md={5}> {/* Increased width slightly */}
            <Promo />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Dashboard;
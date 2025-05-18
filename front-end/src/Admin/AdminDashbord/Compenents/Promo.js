import React from 'react';
import { Card, Carousel } from 'react-bootstrap';

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
      style={{
        borderRadius: '1rem',
        overflow: 'hidden',
        height: '400px',
        position: 'relative',
        fontFamily: "'Poppins', sans-serif",
      }}
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
          <Carousel.Item key={index} style={{ height: '400px', position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              {/* Background Image */}
              <div
                style={{
                  height: '400px',
                  width: '100%',
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2rem',
                  color: '#fff',
                }}
              ></div>

              {/* Content */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2rem',
                  color: '#fff',
                }}
              >
                <div style={{ maxWidth: '70%' }}>
                  <h4 className="fw-bold mb-3">{slide.title}</h4>
                  <p className="lead">{slide.description}</p>
                </div>
              </div>

              {/* Bottom left text */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#fff',
                  zIndex: 5,
                  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                  fontFamily: "'Montserrat', sans-serif",
                  maxWidth: '50%',
                }}
              >
                {slide.title}
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Poppins&display=swap');

        .carousel-control-prev, .carousel-control-next {
          top: 50%;
          transform: translateY(-50%);
          width: 2.5rem;
          height: 2.5rem;
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
          width: 1.2rem;
          height: 1.2rem;
        }
      `}</style>
    </Card>
  );
};

export default Promo;
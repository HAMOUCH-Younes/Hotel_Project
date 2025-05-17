import React from 'react';
import { Card, Carousel } from 'react-bootstrap';

const slides = [
  {
    title: 'Faster way to create web pages',
    description: "That's my skill. I'm not really specially talented at anything except for the ability to learn.",
    image: 'https://media.istockphoto.com/id/2125930371/fr/photo/waves-of-particles.webp?a=1&b=1&s=612x612&w=0&k=20&c=3svnItoCW9us58vtLcIgiq-IqkgsCup1isy14dOWQco=',
  },
  {
    title: 'Design with Purpose',
    description: 'Start from an idea and shape it into a clean, modern UI.',
    image: 'https://plus.unsplash.com/premium_photo-1687686677659-8c31848a69cf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzaWduJTJDY3JlYXRpdmV8ZW58MHx8MHx8fDA%3D',
  },
  {
    title: 'Code Smart, Build Fast',
    description: 'Use tools that empower you to focus on logic, not boilerplate.',
    image: 'https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvZGluZyUyQ2RldmVsb3BlcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    title: 'Deploy with Confidence',
    description: 'Ship faster with stable, scalable setups.',
    image: 'https://media.istockphoto.com/id/941594596/fr/photo/le-cloud-computing-avec-pluie-code-machine.webp?a=1&b=1&s=612x612&w=0&k=20&c=mE1XJgAeFWhX5HJP45u37H0g_xQPM_XZ-PQLWSNGAz4=',
  },
];

function Promo() {
  return (
    <Card
  className="text-white border-0 shadow"
  style={{
    borderRadius: '1rem',
    overflow: 'hidden',
    height: '420px', // +5% from 400px
    width: '110%',   // +10% from 100%
    position: 'relative',
    marginRight:'50px',
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
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index} className="h-100">
            <div
              className="d-flex align-items-center h-100"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '3rem',
              }}
            >
              <div style={{ maxWidth: '50%' }}>
                <h2 className="fw-bold mb-3" style={{ fontSize: '2rem' }}>{slide.title}</h2>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{slide.description}</p>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom Arrows Top-Right */}
      <style>
        {`
          .carousel-control-prev, .carousel-control-next {
            top: 1rem;
            right: 1rem;
            left: auto;
            width: 2.8rem;
            height: 2.8rem;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
          }

          .carousel-control-prev {
            right: 4rem;
          }

          .carousel-control-prev-icon, .carousel-control-next-icon {
            filter: invert(1);
            background-size: 100% 100%;
          }
        `}
      </style>
    </Card>
  );
}

export default Promo;

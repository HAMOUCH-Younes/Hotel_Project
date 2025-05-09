import React from 'react';
import image from '../assets/a.png'

const hotelData = [
    {
        image: image,
        bestSeller: true,
        title: 'Urbanza Suites',
        address: 'Main Road 123 Street, 23 Colony',
        rating: 4.5,
        price: 399,
    },
    {
        image: image,
        bestSeller: false,
        title: 'Urbanza Suites',
        address: 'Main Road 123 Street, 23 Colony',
        rating: 4.5,
        price: 299,
    },
    {
        image: image,
        bestSeller: true,
        title: 'Urbanza Suites',
        address: 'Main Road 123 Street, 23 Colony',
        rating: 4.5,
        price: 249,
    },
    {
        image: image,
        bestSeller: false,
        title: 'Urbanza Suites',
        address: 'Main Road 123 Street, 23 Colony',
        rating: 4.5,
        price: 199,
    },
];

const FeaturedDestinations = () => {
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Featured Destination</h2>
                <p className="text-muted">
                    Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.
                </p>
            </div>
            <div className="row">
                {hotelData.map((hotel, index) => (
                    <div className="col-md-3 mb-4" key={index}>
                        <div className="card shadow-sm h-100">
                            <div className="position-relative">
                                <img src={hotel.image} className="card-img-top" alt={hotel.title} />
                                {hotel.bestSeller && (
                                    <span className="badge bg-light text-dark position-absolute top-0 start-0 m-2">Best Seller</span>
                                )}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">{hotel.title}</h5>
                                <p className="card-text text-muted mb-1">
                                    <i className="fas fa-map-marker-alt me-1"></i> {hotel.address}
                                </p>
                                <p className="text-warning mb-2">
                                    <i className="fas fa-star me-1"></i> {hotel.rating}
                                </p>

                                <p className="h5">${hotel.price}<small className="text-muted">/night</small></p>
                                <button className="btn btn-outline-secondary w-100 mt-2">Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-outline-dark">View All Destinations</button>
            </div>
        </div>
    );
};

export default FeaturedDestinations;

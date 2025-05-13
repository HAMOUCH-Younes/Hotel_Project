import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import {
    FaHome,
    FaMountain,
    FaSwimmingPool,
    FaShieldAlt,
    FaBroom,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaCalendarAlt,
    FaMoon,
    FaDollarSign,
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Form state for availability check
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
    });
    const [availabilityResult, setAvailabilityResult] = useState(null);
    const [availabilityError, setAvailabilityError] = useState(null);

    // Booking form state
    const [bookingData, setBookingData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        paymentMethod: 'online',
        additionalNotes: '',
    });
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const [bookingError, setBookingError] = useState(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const roomId = searchParams.get('room_id');

    // Fetch room details
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomId}`);
                const roomData = response.data;
                setRoom(roomData);
                setMainImage(roomData.image || 'https://via.placeholder.com/800x600');
            } catch (err) {
                setError('Failed to load room details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            fetchRoom();
        } else {
            setError('No room ID provided.');
            setLoading(false);
        }
    }, [roomId]);

    // Fetch user details to pre-fill fullName and email
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    setBookingError('User not logged in. Please log in to proceed with booking.');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const userData = response.data;

                setBookingData((prev) => ({
                    ...prev,
                    fullName: userData.name || '',
                    email: userData.email || '',
                }));
            } catch (err) {
                setBookingError('Failed to load user data. You can still enter your details manually.');
            }
        };

        fetchUserData();
    }, []);

    // Get today's date in YYYY-MM-DD format for the min attribute
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Calculate the minimum Check-out date (day after Check-in)
    const getMinCheckOutDate = () => {
        if (!formData.checkIn) return '';
        const checkInDate = new Date(formData.checkIn);
        checkInDate.setDate(checkInDate.getDate() + 1);
        return checkInDate.toISOString().split('T')[0];
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            let updatedFormData = { ...prev, [name]: value };

            // If Check-in date changes, adjust Check-out date
            if (name === 'checkIn' && value) {
                const checkInDate = new Date(value);
                const minCheckOutDate = new Date(value);
                minCheckOutDate.setDate(checkInDate.getDate() + 1);
                const minCheckOutStr = minCheckOutDate.toISOString().split('T')[0];

                // If Check-out is not set or is earlier than the new Check-in + 1, set it to Check-in + 1
                if (!updatedFormData.checkOut || new Date(updatedFormData.checkOut) <= checkInDate) {
                    updatedFormData.checkOut = minCheckOutStr;
                }
            }

            // If Check-out date is set before Check-in + 1, reset it
            if (name === 'checkOut' && updatedFormData.checkIn) {
                const checkInDate = new Date(updatedFormData.checkIn);
                const checkOutDate = new Date(value);
                const minCheckOutDate = new Date(updatedFormData.checkIn);
                minCheckOutDate.setDate(checkInDate.getDate() + 1);
                if (checkOutDate <= checkInDate) {
                    updatedFormData.checkOut = minCheckOutDate.toISOString().split('T')[0];
                }
            }

            return updatedFormData;
        });
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name, date) => {
        const value = date ? date.toISOString().split('T')[0] : '';
        setFormData((prev) => {
            let updatedFormData = { ...prev, [name]: value };

            // If Check-in date changes, adjust Check-out date
            if (name === 'checkIn' && value) {
                const checkInDate = new Date(value);
                const minCheckOutDate = new Date(value);
                minCheckOutDate.setDate(checkInDate.getDate() + 1);
                const minCheckOutStr = minCheckOutDate.toISOString().split('T')[0];

                // If Check-out is not set or is earlier than the new Check-in + 1, set it to Check-in + 1
                if (!updatedFormData.checkOut || new Date(updatedFormData.checkOut) <= checkInDate) {
                    updatedFormData.checkOut = minCheckOutStr;
                }
            }

            // If Check-out date is set before Check-in + 1, reset it
            if (name === 'checkOut' && updatedFormData.checkIn) {
                const checkInDate = new Date(updatedFormData.checkIn);
                const checkOutDate = new Date(value);
                const minCheckOutDate = new Date(updatedFormData.checkIn);
                minCheckOutDate.setDate(checkInDate.getDate() + 1);
                if (checkOutDate <= checkInDate) {
                    updatedFormData.checkOut = minCheckOutDate.toISOString().split('T')[0];
                }
            }

            return updatedFormData;
        });
    };

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setAvailabilityResult(null);
        setAvailabilityError(null);

        if (!formData.checkIn || !formData.checkOut || formData.guests < 1) {
            setAvailabilityError('Please fill in all fields and ensure the number of guests is at least 1.');
            return;
        }

        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            setAvailabilityError('Check-in date cannot be in the past.');
            return;
        }
        if (checkOutDate <= checkInDate) {
            setAvailabilityError('Check-out date must be after the check-in date.');
            return;
        }

        if (room && formData.guests > room.max_guests) {
            setAvailabilityError(`This room can accommodate a maximum of ${room.max_guests} guests.`);
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/rooms/${roomId}/check-availability`, {
                check_in: formData.checkIn,
                check_out: formData.checkOut,
                guests: formData.guests,
            });
            setAvailabilityResult(response.data);
        } catch (err) {
            setAvailabilityError(err.response?.data?.message || 'Failed to check availability. Please try again.');
        }
    };

    const handleBookNow = async (e) => {
        e.preventDefault();
        setBookingSuccess(null);
        setBookingError(null);
    
        if (!bookingData.fullName || !bookingData.phoneNumber) {
            setBookingError('Please provide your full name and phone number.');
            return;
        }
    
        try {
            const token = localStorage.getItem('token'); // Retrieve the token
            const response = await axios.post('http://127.0.0.1:8000/api/bookings', {
                room_id: roomId,
                check_in: formData.checkIn,
                check_out: formData.checkOut,
                guests: formData.guests,
                full_name: bookingData.fullName,
                phone_number: bookingData.phoneNumber,
                email: bookingData.email || null,
                payment_method: bookingData.paymentMethod,
                additional_notes: bookingData.additionalNotes || null,
                number_of_nights: calculateNumberOfNights(),
                total_price: calculateTotalPrice(),
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token to the header
                },
            });
            setBookingSuccess('Booking confirmed successfully!');
            setBookingData({
                fullName: '',
                phoneNumber: '',
                email: '',
                paymentMethod: 'online',
                additionalNotes: '',
            });
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Failed to confirm booking. Please try again.');
        }
    };

    const calculateNumberOfNights = () => {
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const timeDiff = checkOutDate - checkInDate;
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };

    const calculateTotalPrice = () => {
        const nights = calculateNumberOfNights();
        let basePrice = nights * (room?.price_per_night || 0);
        const discount = room.hotel?.is_best_seller ? 0.2 : 0;
        return (basePrice * (1 - discount)).toFixed(2);
    };

    const galleryImages = room?.images?.map((img) => img.image) || [
        'https://www.1hotels.com/sites/1hotels.com/files/styles/card/public/brandfolder/kkmmbmqpc8gmjtgffsgwnhw/RM655-01-_Ocean_Front_Kingh1320.png?h=22f6ab40&itok=AtB7dU9x',
        'https://dq5r178u4t83b.cloudfront.net/wp-content/uploads/sites/125/2020/06/15182916/Sofitel-Dubai-Wafi-Luxury-Room-Bedroom-Skyline-View-Image1_WEB.jpg',
        'https://thelibrary.mgmresorts.com/transform/I21tK2uLNwJ896Sa/NEW131925949.tif?format=webp&io=transform%3Afill%2Cwidth%3A760%2Cheight%3A784&quality=75',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
    ];

    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
        setSelectedImage(imageUrl);
    };

    if (loading) return <div className="text-center"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!room) return <div className="text-center">Room not found.</div>;

    const customHeader = ({ date, decreaseMonth, increaseMonth }) => (
        <div
            style={{
                background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)',
                color: '#fff',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <button
                onClick={decreaseMonth}
                style={{
                    border: 'none',
                    background: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                <span>&lt;</span>
            </button>
            <span style={{ fontWeight: 600 }}>
                {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button
                onClick={increaseMonth}
                style={{
                    border: 'none',
                    background: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                <span>&gt;</span>
            </button>
        </div>
    );

    return (
        <div style={{ marginTop: '100px', marginBottom: '30px' }}>
            <Container className="mt-5">
                {/* Info Text */}
                <Row className="mb-4">
                    <Col>
                        <h3 className="fw-bold">{room.name}</h3>
                        <p className="text-warning mb-1">
                            {renderStars(room.hotel?.rating || 0)} <span className="text-dark">{room.hotel?.reviews?.length || 0}+ reviews</span>
                        </p>
                        <p className="text-muted mb-1">
                            <i className="fas fa-map-marker-alt me-1"></i> {room.hotel?.address || 'Unknown Address'}, {room.hotel?.city}, {room.hotel?.country}
                        </p>
                        {room.hotel?.is_best_seller && <span className="badge bg-warning text-dark">20% OFF</span>}
                    </Col>
                </Row>

                {/* Image Section */}
                <Row style={{ height: '400px' }}>
                    <Col md={7}>
                        <div style={{ height: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <img
                                src={mainImage}
                                alt="Main Room"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    </Col>

                    <Col md={5}>
                        <div
                            style={{
                                height: '400px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                padding: '4px',
                                borderRadius: '15px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            {galleryImages.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageClick(image)}
                                    style={{
                                        width: 'calc(50% - 4px)',
                                        height: 'calc(50% - 4px)',
                                        boxSizing: 'border-box',
                                        cursor: 'pointer',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        border: selectedImage === image ? '2px solid #ff6200' : 'none',
                                        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* New Section: Experience Luxury Like Never Before */}
                <Row className="mt-5">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-semibold">Experience Luxury Like Never Before</h5>
                            <h6 className="text-dark" style={{ marginRight: '20px' }}>${room.price_per_night}/night</h6>
                        </div>

                        {/* Amenities Section with Background */}
                        <div className="d-flex gap-3 mb-4 justify-content-start">
                            <div
                                className="px-3 py-2 rounded d-flex align-items-center"
                                style={{ backgroundColor: '#f2f2f2' }}
                            >
                                <FaHome className="me-2" />
                                <small>Room Service</small>
                            </div>
                            <div
                                className="px-3 py-2 rounded d-flex align-items-center"
                                style={{ backgroundColor: '#f2f2f2' }}
                            >
                                <FaMountain className="me-2" />
                                <small>Mountain View</small>
                            </div>
                            <div
                                className="px-3 py-2 rounded d-flex align-items-center"
                                style={{ backgroundColor: '#f2f2f2' }}
                            >
                                <FaSwimmingPool className="me-2" />
                                <small>Pool Access</small>
                            </div>
                        </div>

                        {/* Check Availability Form */}
                        <Row className="justify-content-center my-5 mb-5">
                            <Col md={10} lg={8}>
                                <div
                                    className="p-4 border rounded shadow-lg"
                                    style={{
                                        maxWidth: '700px',
                                        margin: '0 auto',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <Form onSubmit={handleCheckAvailability}>
                                        <Row>
                                            <Col md={3} className="border-end">
                                                <Form.Group>
                                                    <Form.Label className="small mb-1">Check-in</Form.Label>
                                                    <DatePicker
                                                        selected={formData.checkIn ? new Date(formData.checkIn) : null}
                                                        onChange={(date) => handleDateChange('checkIn', date)}
                                                        minDate={new Date()}
                                                        dateFormat="yyyy-MM-dd"
                                                        className="form-control form-control-sm border rounded"
                                                        style={{
                                                            padding: '0.375rem 0.75rem',
                                                            fontSize: '0.875rem',
                                                        }}
                                                        required
                                                        renderCustomHeader={customHeader}
                                                        dayClassName={(date) => {
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0);
                                                            if (date < today) return 'text-muted disabled-day';
                                                            return '';
                                                        }}
                                                        popperClassName="custom-datepicker"
                                                        popperProps={{ strategy: 'fixed' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={3} className="border-end">
                                                <Form.Group>
                                                    <Form.Label className="small mb-1">Check-out</Form.Label>
                                                    <DatePicker
                                                        selected={formData.checkOut ? new Date(formData.checkOut) : null}
                                                        onChange={(date) => handleDateChange('checkOut', date)}
                                                        minDate={formData.checkIn ? new Date(new Date(formData.checkIn).setDate(new Date(formData.checkIn).getDate() + 1)) : null}
                                                        dateFormat="yyyy-MM-dd"
                                                        className="form-control form-control-sm border rounded"
                                                        style={{
                                                            padding: '0.375rem 0.75rem',
                                                            fontSize: '0.875rem',
                                                        }}
                                                        required
                                                        disabled={!formData.checkIn}
                                                        renderCustomHeader={customHeader}
                                                        dayClassName={(date) => {
                                                            if (formData.checkIn && date <= new Date(formData.checkIn)) return 'text-muted disabled-day';
                                                            return '';
                                                        }}
                                                        popperClassName="custom-datepicker"
                                                        popperProps={{ strategy: 'fixed' }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                                <Form.Group>
                                                    <Form.Label className="small mb-1">Guests</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        size="sm"
                                                        name="guests"
                                                        value={formData.guests}
                                                        onChange={handleInputChange}
                                                        min={1}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4} className="d-flex align-items-center justify-content-center mt-3 mt-md-0">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    type="submit"
                                                    style={{ paddingLeft: '16px', paddingRight: '16px', fontSize: '0.85rem' }}
                                                >
                                                    Check Availability
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>

                                    {/* Display availability result */}
                                    {availabilityResult && (
                                        <Alert variant={availabilityResult.available ? 'success' : 'warning'} className="mt-3">
                                            {availabilityResult.message}
                                        </Alert>
                                    )}
                                    {availabilityError && (
                                        <Alert variant="danger" className="mt-3">
                                            {availabilityError}
                                        </Alert>
                                    )}

                                    {/* Booking Form (shown only if available) */}
                                    {availabilityResult?.available && (
                                        <div className="mt-4 p-4 rounded" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                            <h6 className="fw-bold mb-4 text-primary">Confirm Your Booking</h6>
                                            {/* Booking Summary */}
                                            <div
                                                className="mb-4 p-4 rounded shadow-sm"
                                                style={{
                                                    background: 'linear-gradient(135deg, #e6f0fa 0%, #f5f7fa 100%)',
                                                    transition: 'transform 0.2s ease-in-out',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
                                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                            >
                                                <h6 className="fw-semibold mb-3 text-dark">Booking Summary</h6>
                                                <Row>
                                                    <Col md={6}>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaCalendarAlt className="me-2 text-primary" />
                                                            <span className="fw-medium">Check-in:</span>
                                                            <span className="fs-5 text-dark">{formData.checkIn}</span>
                                                        </p>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaCalendarAlt className="me-2 text-primary" />
                                                            <span className="fw-medium">Check-out:</span>
                                                            <span className="fs-5 text-dark">{formData.checkOut}</span>
                                                        </p>
                                                    </Col>
                                                    <Col md={6}>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaMoon className="me-2 text-primary" />
                                                            <span className="fw-medium">Number of Nights:</span>
                                                            <span className="fs-5 text-dark">{calculateNumberOfNights()}</span>
                                                        </p>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaDollarSign className="me-2 text-primary" />
                                                            <span className="fw-medium">Price per Night:</span>
                                                            <span className="fs-5 text-dark">${room.price_per_night}</span>
                                                        </p>
                                                        <p className="mb-2 d-flex align-items-center">
                                                            <FaDollarSign className="me-2 text-primary" />
                                                            <span className="fw-medium">Total Price:</span>
                                                            <span className="fs-5 text-dark">
                                                                ${calculateTotalPrice()}
                                                                {room.hotel?.is_best_seller && <span className="text-success ms-2">(20% OFF)</span>}
                                                            </span>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>

                                            <hr className="my-4" style={{ borderColor: '#dee2e6' }} />

                                            <Form onSubmit={handleBookNow}>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="fw-medium">Full Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="fullName"
                                                                value={bookingData.fullName}
                                                                onChange={handleBookingChange}
                                                                required
                                                                className="border rounded"
                                                                style={{
                                                                    padding: '10px',
                                                                    transition: 'border-color 0.2s ease-in-out',
                                                                }}
                                                                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                                                onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="fw-medium">Phone Number</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="phoneNumber"
                                                                value={bookingData.phoneNumber}
                                                                onChange={handleBookingChange}
                                                                required
                                                                className="border rounded"
                                                                style={{
                                                                    padding: '10px',
                                                                    transition: 'border-color 0.2s ease-in-out',
                                                                }}
                                                                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                                                onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="fw-medium">Email (Optional)</Form.Label>
                                                            <Form.Control
                                                                type="email"
                                                                name="email"
                                                                value={bookingData.email}
                                                                onChange={handleBookingChange}
                                                                className="border rounded"
                                                                style={{
                                                                    padding: '10px',
                                                                    transition: 'border-color 0.2s ease-in-out',
                                                                }}
                                                                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                                                onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="fw-medium">Payment Method</Form.Label>
                                                            <Form.Select
                                                                name="paymentMethod"
                                                                value={bookingData.paymentMethod}
                                                                onChange={handleBookingChange}
                                                                required
                                                                className="border rounded"
                                                                style={{
                                                                    padding: '10px',
                                                                    transition: 'border-color 0.2s ease-in-out',
                                                                }}
                                                                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                                                onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                                                            >
                                                                <option value="online">Online</option>
                                                                <option value="on_arrival">On Arrival</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Form.Group className="mb-4">
                                                            <Form.Label className="fw-medium">Additional Notes (Optional)</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={3}
                                                                name="additionalNotes"
                                                                value={bookingData.additionalNotes}
                                                                onChange={handleBookingChange}
                                                                className="border rounded"
                                                                style={{
                                                                    padding: '10px',
                                                                    transition: 'border-color 0.2s ease-in-out',
                                                                }}
                                                                onFocus={(e) => (e.target.style.borderColor = '#007bff')}
                                                                onBlur={(e) => (e.target.style.borderColor = '#ced4da')}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Button
                                                    type="submit"
                                                    className="mt-3 px-5 py-2"
                                                    style={{
                                                        background: 'linear-gradient(90deg, #007bff 0%, #0056b3 100%)',
                                                        border: 'none',
                                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'scale(1.05)';
                                                        e.target.style.boxShadow = '0 4px 15px rgba(0,123,255,0.3)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    Book Now
                                                </Button>
                                                {bookingSuccess && (
                                                    <Alert variant="success" className="mt-4">
                                                        {bookingSuccess}
                                                    </Alert>
                                                )}
                                                {bookingError && (
                                                    <Alert variant="danger" className="mt-4">
                                                        {bookingError}
                                                    </Alert>
                                                )}
                                            </Form>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        {/* Additional Details */}
                        <div>
                            <div className="d-flex align-items-start mb-3">
                                <FaShieldAlt className="me-3 mt-1" size={18} />
                                <div>
                                    <h6 className="fw-bold small mb-1">Clean & Safe Stay</h6>
                                    <p className="text-muted small mb-0">A well-maintained and hygienic space just for you.</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-start mb-3">
                                <FaBroom className="me-3 mt-1" size={18} />
                                <div>
                                    <h6 className="fw-bold small mb-1">Enhanced Cleaning</h6>
                                    <p className="text-muted small mb-0">This host follows Staybnb's strict cleaning standards.</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-start mb-3">
                                <FaMapMarkerAlt className="me-3 mt-1" size={18} />
                                <div>
                                    <h6 className="fw-bold small mb-1">Excellent Location</h6>
                                    <p className="text-muted small mb-0">90% of guests rated the location 5 stars.</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-start">
                                <FaCheckCircle className="me-3 mt-1" size={18} />
                                <div>
                                    <h6 className="fw-bold small mb-1">Smooth Check-in</h6>
                                    <p className="text-muted small mb-0">100% of guests gave check-in a 5-star rating.</p>
                                </div>
                            </div>
                        </div>

                        <Row className="mt-4">
                            <Col md={8} className="offset-md-2">
                                <div
                                    style={{
                                        padding: '30px',
                                        borderTop: '1.5px solid #ddd',
                                        borderBottom: '1.5px solid #ddd',
                                        textAlign: 'left',
                                        marginRight: '60px',
                                        marginTop: '20px',
                                        marginLeft: '-180px',
                                    }}
                                >
                                    <p>
                                        {room.description || 'No description available for this room.'}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <style>
                {`
                    .custom-datepicker {
                        border: none !important;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
                        border-radius: 10px !important;
                        font-family: 'Arial', sans-serif !important;
                        background-color: #fff !important;
                    }
                    .custom-datepicker .react-datepicker__header {
                        background: linear-gradient(90deg, #007bff 0%, #0056b3 100%) !important;
                        color: #fff !important;
                        border-top-left-radius: 10px !important;
                        border-top-right-radius: 10px !important;
                        padding: 15px !important;
                        border-bottom: none !important;
                    }
                    .custom-datepicker .react-datepicker__current-month,
                    .custom-datepicker .react-datepicker__day-name {
                        color: #fff !important;
                        font-weight: 600 !important;
                    }
                    .custom-datepicker .react-datepicker__navigation {
                        top: 15px !important;
                    }
                    .custom-datepicker .react-datepicker__navigation--previous {
                        border-right-color: #fff !important;
                    }
                    .custom-datepicker .react-datepicker__navigation--next {
                        border-left-color: #fff !important;
                    }
                    .custom-datepicker .react-datepicker__day {
                        color: #333 !important;
                        font-weight: 500 !important;
                        padding: 5px !important;
                        margin: 2px !important;
                        border-radius: 50% !important;
                        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out !important;
                    }
                    .custom-datepicker .react-datepicker__day:hover {
                        background-color: #e6f0fa !important;
                        color: #007bff !important;
                    }
                    .custom-datepicker .react-datepicker__day--selected,
                    .custom-datepicker .react-datepicker__day--keyboard-selected {
                        background-color: #007bff !important;
                        color: #fff !important;
                    }
                    .custom-datepicker .react-datepicker__day--disabled {
                        color: #ccc !important;
                        cursor: not-allowed !important;
                    }
                    .custom-datepicker .react-datepicker__day--disabled:hover {
                        background-color: transparent !important;
                        color: #ccc !important;
                    }
                    .custom-datepicker .react-datepicker__day-name {
                        color: #fff !important;
                        font-size: 0.85rem !important;
                        padding: 5px !important;
                    }
                    .custom-datepicker .react-datepicker__triangle {
                        display: none !important;
                    }
                    .text-muted.disabled-day {
                        color: #ccc !important;
                        cursor: not-allowed !important;
                    }
                `}
            </style>
        </div>
    );
};

// Reusing renderStars from Rooms
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<i key={i} className="fas fa-star me-1"></i>);
        } else if (i === fullStars && hasHalfStar) {
            stars.push(<i key={i} className="fas fa-star-half-alt me-1"></i>);
        } else {
            stars.push(<i key={i} className="far fa-star me-1"></i>);
        }
    }
    return stars;
};

export default Booking;
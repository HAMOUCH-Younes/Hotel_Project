import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaMoon, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Activitie = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in to view your bookings.');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/bookings', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const bookingsData = response.data.data || response.data;
                console.log('Bookings data:', bookingsData);
                setBookings(bookingsData);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load bookings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserBookings();
    }, [navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/bookings/${bookingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Remove the booking from the state to update the UI
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
            // Show success toast
            toast.success('Booking cancelled successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (err) {
            // Show error toast
            toast.error(err.response?.data?.message || 'Failed to cancel booking. Please try again.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5" style={{ minHeight: '70vh',marginTop: '100px', marginBottom: '30px' }}>
                <Spinner animation="border" role="status" variant="primary" size="lg">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
    if (error) return <Alert variant="danger" className="mt-4 mx-auto" style={{ maxWidth: '600px' }}>{error}</Alert>;
    if (bookings.length === 0) return <Alert variant="info" className="mt-4 mx-auto" style={{ maxWidth: '600px' }}>You have no bookings yet.</Alert>;

    return (
        <div style={{ marginTop: '100px', marginBottom: '30px' }}>
            <Container className="mt-5 mb-5">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-dark" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '1px' }}>
                                Your Booking Activities
                            </h2>
                            <div className="border-bottom border-primary border-2 w-25 mx-auto my-3" style={{ transition: 'width 0.3s ease' }}></div>
                        </div>
                        <div className="card shadow-sm p-4" style={{ borderRadius: '15px', backgroundColor: '#ffffff' }}>
                            <Table striped bordered hover responsive className="table-custom">
                                <thead className="bg-primary text-white">
                                    <tr>
                                        <th className="py-3">Room</th>
                                        <th className="py-3">Check-in</th>
                                        <th className="py-3">Check-out</th>
                                        <th className="py-3">Nights</th>
                                        <th className="py-3">Total Price</th>
                                        <th className="py-3">Location</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => {
                                        const checkIn = new Date(booking.check_in);
                                        const checkOut = new Date(booking.check_out);
                                        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                                        return (
                                            <tr key={booking.id} className="align-middle" style={{ transition: 'background-color 0.3s ease' }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                                                <td>{booking.room?.name || 'N/A'}</td>
                                                <td>
                                                    <FaCalendarAlt className="me-2 text-primary" />
                                                    {checkIn.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </td>
                                                <td>
                                                    <FaCalendarAlt className="me-2 text-primary" />
                                                    {checkOut.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </td>
                                                <td>
                                                    <FaMoon className="me-2 text-primary" />
                                                    {nights}
                                                </td>
                                                <td>
                                                    <FaDollarSign className="me-2 text-primary" />
                                                    {(booking.total_price ? Number(booking.total_price) : 0).toFixed(2)}
                                                </td>
                                                <td>
                                                    <FaMapMarkerAlt className="me-2 text-primary" />
                                                    {booking.room?.hotel?.address || 'N/A'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${booking.status === 'pending' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {booking.status === 'pending' && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="cancel-btn"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </div>
    );
};

// Add custom CSS
const styles = `
    .table-custom {
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .table-custom th {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
    }
    .table-custom td {
        vertical-align: middle;
        font-size: 0.95rem;
        color: #333;
    }
    .badge {
        padding: 8px 12px;
        border-radius: 10px;
        font-weight: 500;
    }
    .bg-warning.text-dark {
        background-color: #ffc107 !important;
        color: #212529 !important;
    }
    .bg-success.text-white {
        background-color: #28a745 !important;
    }
    .cancel-btn {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    .cancel-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    }
`;

// Inject styles into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Activitie;
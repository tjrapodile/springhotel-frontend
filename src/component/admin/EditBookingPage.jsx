import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; // Adjust the path as needed
import './EditBookingPage.css'; // Import the CSS

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);

    const acheiveBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("The booking was successfully cancelled");

                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="edit-booking-page">
            <h2>Booking Detail</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p><span className="label">Confirmation Code:</span> {bookingDetails.bookingConfirmationCode}</p>
                    <p><span className="label">Check-in Date:</span> {bookingDetails.checkInDate}</p>
                    <p><span className="label">Check-out Date:</span> {bookingDetails.checkOutDate}</p>
                    <p><span className="label">Num Of Adults:</span> {bookingDetails.numberOfAdults}</p>
                    <p><span className="label">Num Of Children:</span> {bookingDetails.numberOfChildren}</p>
                    <p><span className="label">Guest Email:</span> {bookingDetails.user.email}</p>

                    <hr />

                    <h3>Booker Details</h3>
                    <p><span className="label">Name:</span> {bookingDetails.user.name}</p>
                    <p><span className="label">Email:</span> {bookingDetails.user.email}</p>
                    <p><span className="label">Phone Number:</span> {bookingDetails.user.phoneNumber}</p>

                    <hr />

                    <h3>Room Details</h3>
                    <p><span className="label">Room Type:</span> {bookingDetails.room.roomType}</p>
                    <p><span className="label">Room Price:</span> ${bookingDetails.room.roomPrice}</p>
                    <p><span className="label">Room Description:</span> {bookingDetails.room.roomDescription}</p>
                    <img src={bookingDetails.room.roomPhotoUrl} alt="Room" className="room-image" />

                    <button
                        className="cancel-button"
                        onClick={() => acheiveBooking(bookingDetails.id)}>Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;

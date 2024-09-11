import React, { useState } from 'react';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js
import './FindBookingPage.css'; // Import the CSS

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please Enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleCancelBooking = () => {
        const cancelEmail = `mailto:admin@hotel.com?subject=Cancel Booking&body=Please cancel booking with confirmation code: ${confirmationCode}`;
        window.location.href = cancelEmail;
    };

    return (
        <div className="find-booking-page">
            <h2>Find Booking</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter your booking confirmation code"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />
                <button onClick={handleSearch}>Find</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Booking Details</h3>
                    <p><span className="label">Confirmation Code:</span> {bookingDetails.bookingConfirmationCode}</p>
                    <p><span className="label">Check-in Date:</span> {bookingDetails.checkInDate}</p>
                    <p><span className="label">Check-out Date:</span> {bookingDetails.checkOutDate}</p>
                    <p><span className="label">Num Of Adults:</span> {bookingDetails.numberOfAdults}</p>
                    <p><span className="label">Num Of Children:</span> {bookingDetails.numberOfChildren}</p>

                    <hr />

                    <h3>Booker Details</h3>
                    <p><span className="label">Name:</span> {bookingDetails.user.name}</p>
                    <p><span className="label">Email:</span> {bookingDetails.user.email}</p>
                    <p><span className="label">Phone Number:</span> {bookingDetails.user.phoneNumber}</p>

                    <hr />

                    <h3>Room Details</h3>
                    <p><span className="label">Room Type:</span> {bookingDetails.room.roomType}</p>
                    <img src={bookingDetails.room.roomPhotoUrl} alt="Room" className="room-image" />

                    <button className="cancel-button" onClick={handleCancelBooking}>Contact Hotel To Cancel/Update Your Booking</button>
                </div>
            )}
        </div>
    );
};

export default FindBookingPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService'; // Assuming your service is in a file called ApiService.js
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RoomDetailsPage.css'; // Custom CSS

const RoomDetailsPage = () => {
  const navigate = useNavigate(); 
  const { roomId } = useParams(); 
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [checkInDate, setCheckInDate] = useState(null); 
  const [checkOutDate, setCheckOutDate] = useState(null); 
  const [numberOfAdults, setNumberOfAdults] = useState(1); // Updated
  const [numberOfChildren, setNumberOfChildren] = useState(0); // Updated
  const [totalPrice, setTotalPrice] = useState(0); 
  const [totalGuests, setTotalGuests] = useState(1); 
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [userId, setUserId] = useState(''); 
  const [showMessage, setShowMessage] = useState(false); 
  const [confirmationCode, setConfirmationCode] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); 
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
        setEmail(userProfile.user.email);
        setPhone(userProfile.user.phone);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchData();
  }, [roomId]);

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000); 
      return;
    }

    if (isNaN(numberOfAdults) || numberOfAdults < 1 || isNaN(numberOfChildren) || numberOfChildren < 0) {
      setErrorMessage('Please enter valid numbers for adults and children.');
      setTimeout(() => setErrorMessage(''), 5000); 
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    const totalGuests = numberOfAdults + numberOfChildren;

    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  const acceptBooking = async () => {
    try {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numberOfAdults, // Updated
        numberOfChildren // Updated
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        window.scrollTo(0, 0);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms'); 
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000); 
    }
  };

  if (isLoading) {
    return <p className='room-detail-loading'>Loading room details...</p>;
  }

  if (error) {
    return <p className='room-detail-loading'>{error}</p>;
  }

  if (!roomDetails) {
    return <p className='room-detail-loading'>Room not found.</p>;
  }

  const { roomType, roomPrice, roomPhotoUrl, roomDescription, bookings } = roomDetails; // Updated

  return (
    <div className="container room-details-booking">
      {
  showMessage && (
    <div className="alert alert-success booking-success-message">
      Booking successful! Confirmation code: {confirmationCode}.<br />
      
      {/* Email Confirmation Link */}
      <a 
        href={`mailto:${email}?subject=Booking%20Confirmation&body=Dear%20User,%0A%0AYour%20booking%20for%20${roomDetails.roomType}%20was%20successful!%0A%0A%20Check-in%20Date:%20${checkInDate}%0A%20Check-out%20Date:%20${checkOutDate}%0A%20Number%20of%20Guests:%20${totalGuests}%0A%20Total%20Price:%20R${totalPrice}%0A%0ABooking%20Confirmation%20Code:%20${confirmationCode}%0A%0AThank%20you%20for%20booking%20with%20us!`}>
        Send Booking Confirmation Email
      </a><br />
      
      {/* SMS Confirmation Link */}
      <a 
        href={`sms:${phone}?body=Your%20booking%20for%20${roomDetails.roomType}%20was%20successful!%0A%20Check-in:%20${checkInDate}%0A%20Check-out:%20${checkOutDate}%0ATotal%20Guests:%20${totalGuests}%0ATotal%20Price:%20R${totalPrice}%0ABooking%20Code:%20${confirmationCode}`}>
        Send Booking Confirmation SMS
      </a>
    </div>
  )
}
      {errorMessage && (
        <div className="alert alert-danger error-message">
          {errorMessage}
        </div>
      )}
      <div>
        <h2>Room Details</h2>
        <br />
        <img src={roomPhotoUrl} alt={roomType} className="room-details-image img-centered" />
        <div className="room-details-info">
          <h3>{roomType}</h3>
          <p>Price: R{roomPrice} / night</p>
          <p>{roomDescription}</p> {/* Updated */}
        </div>
        {bookings && bookings.length > 0 && (
          <div>
            <h3>Existing Booking Details</h3>
            <ul className="booking-list list-group">
              {bookings.map((booking, index) => (
                <li key={booking.id} className="booking-item list-group-item">
                  <span className="booking-number">Booking {index + 1} </span>
                  <span className="booking-text">Check-in: {booking.checkInDate} </span>
                  <span className="booking-text">Out: {booking.checkOutDate}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="booking-info">
          <div className="button-container">
            <button className="book-now-button btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
            <button className="book-now-button btn btn-primary" onClick={() => setShowDatePicker(true)}>Book Now</button>
          </div>
          {showDatePicker && (
            <div className="date-picker-container">
              <DatePicker
                className="detail-search-field form-control"
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                placeholderText="Check-in Date"
                dateFormat="dd/MM/yyyy"
              />
              <DatePicker
                className="detail-search-field form-control"
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate}
                placeholderText="Check-out Date"
                dateFormat="dd/MM/yyyy"
              />
              <div className='guest-container'>
                <div className="guest-div form-group">
                  <label>Adults:</label>
                  <input
                    type="number"
                    min="1"
                    value={numberOfAdults} // Updated
                    onChange={(e) => setNumberOfAdults(parseInt(e.target.value))} // Updated
                    className="form-control"
                  />
                </div>
                <div className="guest-div form-group">
                  <label>Children:</label>
                  <input
                    type="number"
                    min="0"
                    value={numberOfChildren} // Updated
                    onChange={(e) => setNumberOfChildren(parseInt(e.target.value))} // Updated
                    className="form-control"
                  />
                </div>
                <div className="button-container">
                  <button className="confirm-booking btn btn-primary" onClick={handleConfirmBooking}>Confirm Booking</button>
                </div>
              </div>
            </div>
          )}
          {totalPrice > 0 && (
            <div className="total-price">
              <p>Total Price: R{totalPrice}</p>
              <p>Total Guests: {totalGuests}</p>
              <div className="button-container">
                <button onClick={acceptBooking} className="accept-booking btn btn-primary">Accept Booking</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;

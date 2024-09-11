import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import './HomePage.css';

const HomePage = () => {

    const [roomSearchResults, setRoomSearchResults] = useState([]);

    // Function to handle search results
    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    return (
        <div className="home">
            {/* HEADER / BANNER ROOM SECTION */}
            <section>
                <header className="header-banner">
                    <img src="/assets/images/header-image.jpg" alt="Spring Hotel" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Welcome to <span className="spring-color">The Spring Hotel</span>
                        </h1><br />
                        <h3>ENJOY THE ESSENCE OF SPRING</h3>
                    </div>
                </header>
            </section>

            {/* SEARCH/FIND AVAILABLE ROOM SECTION */}
            <div className="container" style={{ marginTop: "20px" }}>
                <RoomSearch handleSearchResult={handleSearchResult} />
                <RoomResult roomSearchResults={roomSearchResults} />
            </div>

            <div className="text-center mt-4">
                <h4><a className="view-rooms-home" href="/rooms">All Rooms</a></h4>
                <h2 className="home-services">Services at <span className="services-color">The Spring Hotel</span></h2>
            </div>

            {/* SERVICES SECTION */}
            <section className="service-section container">
                <div className="row">
                    <div className="col-sm-6 col-md-3 service-card">
                        <img src="./assets/images/ac.png" alt="Air Conditioning" />
                        <div className="service-details">
                            <h3 className="service-title">Air Conditioning</h3>
                            <p className="service-description">Stay cool and comfortable throughout your stay.</p>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3 service-card">
                        <img src="./assets/images/mini-bar.png" alt="Mini Bar" />
                        <div className="service-details">
                            <h3 className="service-title">Mini Bar</h3>
                            <p className="service-description">Enjoy beverages and snacks stocked in your room.</p>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3 service-card">
                        <img src="./assets/images/parking.png" alt="Parking" />
                        <div className="service-details">
                            <h3 className="service-title">Parking</h3>
                            <p className="service-description">On-site parking available for your convenience.</p>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3 service-card">
                        <img src="./assets/images/wifi.png" alt="WiFi" />
                        <div className="service-details">
                            <h3 className="service-title">WiFi</h3>
                            <p className="service-description">Complimentary high-speed Wi-Fi access throughout.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;

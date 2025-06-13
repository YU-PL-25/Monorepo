import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Reservation.css';

function Reservation() {
    return (
        <div className="reservation-wrapper">
            <Header/>
            <div className="reservation-content">
                <h2>Test Reservation Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default Reservation;

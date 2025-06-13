import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Competition.css';

function Competition() {
    return (
        <div className="competition-wrapper">
            <Header/>
            <div className="competition-content">
                <h2>Test Competition Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default Competition;

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Club.css';

function Club() {
    return (
        <div className="club-wrapper">
            <Header/>
            <div className="club-content">
                <h2>Test Club Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default Club;

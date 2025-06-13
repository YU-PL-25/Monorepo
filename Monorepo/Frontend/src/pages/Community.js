import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Community.css';

function Community() {
    return (
        <div className="community-wrapper">
            <Header/>
            <div className="community-content">
                <h2>Test Community Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default Community;

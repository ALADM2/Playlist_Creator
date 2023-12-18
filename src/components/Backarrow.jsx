import './CSS/Backarrow.css'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';

const Backarrow = () => {
    const [showArrow, setShowArrow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if the scroll position is greater than 0
            setShowArrow(window.scrollY > 0);
        };

        // Add event listener for scroll
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // The empty dependency array ensures that the effect runs only once during component mount

    const handleBack = () => {

    };

    return (
        <div className={`backArrow ${showArrow ? 'visible' : ''}`} onClick={handleBack}>
            <Link to='/mainpage'><i className="fa-solid fa-left-long fa-2xl"></i></Link>
        </div>
    )
}

export default Backarrow
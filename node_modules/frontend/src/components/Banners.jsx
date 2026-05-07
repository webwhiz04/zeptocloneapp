import "./Banners.css";

function Banners() {
    return (
        <div className="zepto-banners-container" aria-hidden>
            <div className="zepto-banner">
                <img src="https://via.placeholder.com/1200x300?text=Banner+1" alt="Banner 1" />
            </div>
            <div className="zepto-banner">
                <img src="https://via.placeholder.com/1200x300?text=Banner+2" alt="Banner 2" />
            </div>
        </div>
    );
}

export default Banners;

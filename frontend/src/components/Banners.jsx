import React from "react";
import "./Banners.css";

const Banners = () => {
    return (
        <div className="zepto-banners-container">
            <div className="zepto-banner banner-experience">
                <img 
                    src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/10.15.0/images/home/all-new-zepto-experience.png" 
                    alt="All New Zepto Experience" 
                    onError={(e) => {
                        console.error("Banner 1 failed to load");
                        e.target.src = "https://via.placeholder.com/600x300?text=Zepto+Experience";
                    }}
                />
            </div>
            <div className="zepto-banner banner-paan">
                <img 
                    src="https://cdn.zeptonow.com/web-static-assets-prod/artifacts/10.15.0/images/home/paan-corner.png" 
                    alt="Paan Corner" 
                    onError={(e) => {
                        console.error("Banner 2 failed to load");
                        e.target.src = "https://via.placeholder.com/600x300?text=Paan+Corner";
                    }}
                />
            </div>
        </div>
    );
};

export default Banners;

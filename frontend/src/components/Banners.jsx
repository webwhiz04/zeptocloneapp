import "./Banners.css";

import { getPlaceholderUrl } from "../utils/imageUrl.js";

const Banners = () => {
    return (
        <div className="zepto-banners-container" aria-hidden>
            <div className="zepto-banner">
                <img src={getPlaceholderUrl(1200, 300, "Banner 1")} alt="Banner 1" />
            </div>
            <div className="zepto-banner">
                <img src={getPlaceholderUrl(1200, 300, "Banner 2")} alt="Banner 2" />
            </div>
        </div>
    );
};

export default Banners;

import "./Banners.css";

import { getPlaceholderUrl } from "../utils/imageUrl.js";

const Banners = () => {
    return (
        <div className="zeptoBannersContainer" aria-hidden>
            <div className="zeptoBanner">
                <img src={getPlaceholderUrl(1200, 300, "Banner 1")} alt="Banner 1" />
            </div>
            <div className="zeptoBanner">
                <img src={getPlaceholderUrl(1200, 300, "Banner 2")} alt="Banner 2" />
            </div>
        </div>
    );
};

export default Banners;

'use strict';

import SlickSlider from 'react-slick';

const Slider = ({children, isAutoPlay, hasArrows, hasDots, isLoop, showSlideNumber}) => {
    let settings = {
        arrows: hasArrows,
        dots: hasDots,
        infinite: isLoop,
        speed: 500,
        slidesToShow: showSlideNumber,
        slidesToScroll: 2,
        adaptiveHeight: false,
        lazyLoad: true,
        autoplay: isAutoPlay,
        autoplaySpeed: 4000
    };

    return (
        <SlickSlider {...settings}>
            {children}
        </SlickSlider>
    );
};

Slider.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object
    ]).isRequired,
    isAutoPlay: React.PropTypes.bool,
    hasArrows: React.PropTypes.bool,
    hasDots: React.PropTypes.bool,
    isLoop: React.PropTypes.bool,
    showSlideNumber: React.PropTypes.number
};

Slider.defaultProps = {
    isAutoPlay: false,
    hasArrows: false,
    hasDots: false,
    isLoop: true,
    showSlideNumber: 1
};

export default Slider;

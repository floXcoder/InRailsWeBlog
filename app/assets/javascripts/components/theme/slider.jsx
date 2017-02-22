'use strict';

const SlickSlider = require('react-slick');

const Slider = ({children, isAutoPlay, hasArrows, hasDots}) => {
    let settings = {
        arrows: hasArrows,
        dots: hasDots,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        draggable: false,
        lazyLoad: true,
        autoplay: isAutoPlay,
        autoplaySpeed: 4000,
        centerPadding: true,
        fade: true
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
    hasDots: React.PropTypes.bool
};

Slider.defaultProps = {
    isAutoPlay: false,
    hasArrows: false,
    hasDots: false
};

module.exports = Slider;

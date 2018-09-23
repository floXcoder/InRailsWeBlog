'use strict';

import '../../../stylesheets/components/slick.scss';

import SlickSlider from 'react-slick';

const Slider = ({children, isAutoPlay, hasArrows, hasDots, isLoop, slidesToShow, initialSlide}) => {
    let settings = {
        arrows: hasArrows,
        dots: hasDots,
        infinite: isLoop,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 2,
        adaptiveHeight: false,
        lazyLoad: true,
        initialSlide: initialSlide,
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
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]).isRequired,
    isAutoPlay: PropTypes.bool,
    hasArrows: PropTypes.bool,
    hasDots: PropTypes.bool,
    isLoop: PropTypes.bool,
    slidesToShow: PropTypes.number,
    initialSlide: PropTypes.number
};

Slider.defaultProps = {
    isAutoPlay: false,
    hasArrows: false,
    hasDots: false,
    isLoop: true,
    slidesToShow: 1,
    initialSlide: 0
};

export default Slider;

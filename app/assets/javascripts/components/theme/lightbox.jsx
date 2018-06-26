'use strict';

import ReactImageLightbox from 'react-image-lightbox';

export default class LightBox extends React.Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.shape({
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string,
            title: PropTypes.string,
            copyright: PropTypes.string,
            user: PropTypes.object
        })).isRequired,
        id: PropTypes.string,
        isFullFormat: PropTypes.bool,
        hasSlider: PropTypes.bool,
        isSliderAbove: PropTypes.bool
    };

    static defaultProps = {
        isFullFormat: false,
        hasSlider: false,
        isSliderAbove: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        pictureIndex: 0,
        isOpen: false,
        sliderIndex: 0
    };

    _handleSliderClick = (sliderIndex) => {
        this.setState({
            sliderIndex: sliderIndex
        });
    };

    openLightBox = (pictureIndex, event) => {
        event.preventDefault();

        this.setState({
            isOpen: true,
            pictureIndex: pictureIndex
        });
    };

    closeLightBox = () => {
        this.setState({
            isOpen: false
        });
    };

    moveNext = () => {
        this.setState({pictureIndex: (this.state.pictureIndex + 1) % this.props.children.length});
    };

    movePrev = () => {
        this.setState({pictureIndex: (this.state.pictureIndex + this.props.children.length - 1) % this.props.children.length});
    };

    render() {
        const currentPicture = this.props.children[this.state.pictureIndex];

        const imageTitle = (
            <span>
                {
                    currentPicture.title &&
                    currentPicture.title
                }

                {
                    currentPicture.copyright &&
                    <span> ({currentPicture.copyright})</span>
                }

                {
                    (!currentPicture.copyright && currentPicture.user && currentPicture.user.id !== 1) &&
                    <span>
                        {` (${I18n.t('js.picture.copyright.default')} `}
                        <a href={currentPicture.user.link}>{currentPicture.user.pseudo}</a>
                        )
                    </span>
                }
            </span>
        );

        const slider = (
            <div className="lightbox-slider">
                <div className="lightbox-slider-footer">
                    <ul className="lightbox-slider-thumbnails">
                        {
                            this.props.children.map((picture, i) => (
                                <li key={i}
                                    className={classNames('lightbox-slider-thumbnail', {'lightbox-slider-thumbnail-selected': i === this.state.sliderIndex})}
                                    onClick={this._handleSliderClick.bind(this, i)}>
                                    <img src={picture.thumbnail}
                                         alt={picture.title}/>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );

        return (
            <div id={this.props.id}
                 className="lightbox">
                {
                    !this.props.hasSlider &&
                    this.props.children.map((picture, i) => (
                        <img key={i}
                             className={classNames('img-helper', {
                                 'lightbox-img-full': this.props.isFullFormat,
                                 'lightbox-img-thumbnail': !this.props.isFullFormat
                             })}
                             src={!!picture.thumbnail ? picture.thumbnail : picture.src}
                             alt={picture.title}
                             itemProp="image"
                             onClick={this.openLightBox.bind(this, i)}/>
                    ))
                }

                {
                    this.props.hasSlider &&
                    <div className="lightbox-slider">
                        {
                            this.props.isSliderAbove &&
                            slider
                        }

                        <div className="lightbox-slider-main">
                            <img className="lightbox-img-full"
                                 src={this.props.children[this.state.sliderIndex].src}
                                 alt={this.props.children[this.state.sliderIndex].title}
                                 onClick={this.openLightBox.bind(this, this.state.sliderIndex)}/>
                        </div>

                        {
                            !this.props.isSliderAbove &&
                            slider
                        }
                    </div>
                }

                {
                    this.state.isOpen &&
                    <ReactImageLightbox
                        mainSrc={currentPicture.src}
                        nextSrc={this.props.children.length > 1 ? this.props.children[(this.state.pictureIndex + 1) % this.props.children.length].src : undefined}
                        prevSrc={this.props.children.length > 1 ? this.props.children[(this.state.pictureIndex + this.props.children.length - 1) % this.props.children.length].src : undefined}
                        mainSrcThumbnail={currentPicture.thumbnail}
                        nextSrcThumbnail={this.props.children.length > 1 ? this.props.children[(this.state.pictureIndex + 1) % this.props.children.length].thumbnail : undefined}
                        prevSrcThumbnail={this.props.children.length > 1 ? this.props.children[(this.state.pictureIndex + this.props.children.length - 1) % this.props.children.length].thumbnail : undefined}
                        onCloseRequest={this.closeLightBox}
                        onMovePrevRequest={this.movePrev}
                        onMoveNextRequest={this.moveNext}
                        imageTitle={imageTitle}/>
                }
            </div>
        );
    }
}


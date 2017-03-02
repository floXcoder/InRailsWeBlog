'use strict';

import ReactImageLightbox from 'react-image-lightbox';

export default class LightBox extends React.Component {
    static propTypes = {
        children: React.PropTypes.arrayOf(React.PropTypes.shape({
            src: React.PropTypes.string.isRequired,
            thumbnail: React.PropTypes.string,
            title: React.PropTypes.string,
            copyright: React.PropTypes.string,
            user: React.PropTypes.object
        })).isRequired,
        id: React.PropTypes.string,
        fullFormat: React.PropTypes.bool,
        hasSlider: React.PropTypes.bool
    };

    static defaultProps = {
        id: null,
        fullFormat: false,
        hasSlider: false
    };

    state = {
        pictureIndex: 0,
        isOpen: false,
        sliderIndex: 0
    };

    constructor(props) {
        super(props);
    }

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

        let imageTitle =
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
                    <span> ({I18n.t('js.picture.copyright.default')} <a
                        href={`/users/${currentPicture.user.slug}`}>{currentPicture.user.pseudo}</a>)</span>
                }
        </span>;

        return (
            <div id={this.props.id}
                 className="lightbox">
                {
                    !this.props.hasSlider &&
                    this.props.children.map((picture, i) =>
                        <img key={i}
                             className={classNames('img-helper', {
                                 'lightbox-img-full': this.props.fullFormat,
                                 'lightbox-img-thumbnail': !this.props.fullFormat
                             })}
                             src={!!picture.thumbnail ? picture.thumbnail : picture.src}
                             alt={picture.title}
                             itemProp="image"
                             onClick={this.openLightBox.bind(this, i)}/>
                    )
                }

                {
                    this.props.hasSlider &&
                    <div className="lightbox-slider">
                        <div className="lightbox-slider-main">
                            <img className="lightbox-img-full"
                                 src={this.props.children[this.state.sliderIndex].src}
                                 alt={this.props.children[this.state.sliderIndex].title}
                                 onClick={this.openLightBox.bind(this, this.state.sliderIndex)}/>
                        </div>

                        <div className="lightbox-slider-footer">
                            <ul className="lightbox-slider-thumbnails">
                                {
                                    this.props.children.map((picture, i) =>
                                        <li key={i}
                                            className={classNames('lightbox-slider-thumbnail', {'lightbox-slider-thumbnail-selected': i === this.state.sliderIndex})}
                                            onClick={this._handleSliderClick.bind(this, i)}>
                                            <img src={picture.thumbnail}
                                                 alt={picture.title}/>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                }

                {
                    this.state.isOpen &&
                    <ReactImageLightbox
                        mainSrc={currentPicture.src}
                        nextSrc={this.props.children.length > 1 && this.props.children[(this.state.pictureIndex + 1) % this.props.children.length].src}
                        prevSrc={this.props.children.length > 1 && this.props.children[(this.state.pictureIndex + this.props.children.length - 1) % this.props.children.length].src}
                        mainSrcThumbnail={currentPicture.thumbnail}
                        nextSrcThumbnail={this.props.children.length > 1 && this.props.children[(this.state.pictureIndex + 1) % this.props.children.length].thumbnail}
                        prevSrcThumbnail={this.props.children.length > 1 && this.props.children[(this.state.pictureIndex + this.props.children.length - 1) % this.props.children.length].thumbnail}
                        onCloseRequest={this.closeLightBox}
                        onMovePrevRequest={this.movePrev}
                        onMoveNextRequest={this.moveNext}
                        imageTitle={imageTitle}/>
                }
            </div>
        );
    }
}


'use strict';

import _ from 'lodash';

import UploadActions from '../../actions/uploadActions';
import UploadStore from '../../stores/uploadStore';

import DropZoneComponent from 'react-dropzone-component';

import ReactDOMServer from 'react-dom/server';

export default class DropZone extends Reflux.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        dataModel: PropTypes.string.isRequired,
        dataModelId: PropTypes.number,
        uploadUrl: PropTypes.string,
        className: PropTypes.string,
        dataName: PropTypes.string,
        method: PropTypes.string,
        isMultipleFilesUploaded: PropTypes.bool,
        isAutoUploaded: PropTypes.bool,
        hasRemoveLinks: PropTypes.bool,
        hasLegendField: PropTypes.bool,
        hasCopyrightField: PropTypes.bool,
        acceptedFiles: PropTypes.string,
        maxFiles: PropTypes.number,
        maxFileSize: PropTypes.number,
        dropZoneMessage: PropTypes.string,
        imageInputPlaceholder: PropTypes.string,
        children: PropTypes.object,
        onFileAdded: PropTypes.func,
        onUploadError: PropTypes.func,
        onUploadSuccess: PropTypes.func,
        onUploadRemove: PropTypes.func,
        defaultData: PropTypes.object,
        serverFiles: PropTypes.array,
        onDeleteFile: PropTypes.func
    };

    static defaultProps = {
        dataModelId: null,
        uploadUrl: '/uploads',
        dataName: 'picture',
        method: 'post',
        className: null,
        isAutoUploaded: false,
        isMultipleFilesUploaded: false,
        hasRemoveLinks: true,
        hasLegendField: true,
        hasCopyrightField: false,
        acceptedFiles: null,
        maxFiles: null,
        maxFileSize: null,
        dropZoneMessage: null,
        imageInputPlaceholder: null,
        onFileAdded: null,
        onUploadError: null,
        onUploadSuccess: null,
        onUploadRemove: null,
        defaultData: null,
        serverFiles: null,
        onDeleteFile: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(UploadStore, this.onUploadChange);

        this._dropZone = null;
        this._filesUploaded = [];
        this._isUploading = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    onUploadChange = (uploadData) => {
        if ($.isEmpty(uploadData)) {
            return;
        }

        if (uploadData.type === 'updateUpload') {
            this._isUploading = false;
        }

        if (uploadData.type === 'deleteUpload') {
            this._isUploading = false;
        }
    };

    _initDropZone = (dropZone) => {
        this._dropZone = dropZone;

        if (this.props.serverFiles) {
            this._displayServerFiles();
        }
    };

    _displayServerFiles = () => {
        this.props.serverFiles.map((picture) => {
            const mockFile = {id: picture.id, name: picture.filename, size: picture.size};

            this._dropZone.options.addedfile.call(this._dropZone, mockFile);
            this._dropZone.options.thumbnail.call(this._dropZone, mockFile, picture.thumb_url);

            if (this.props.hasLegendField) {
                const $fileInput = $(`#${this.props.id}`).find('.dropzone-legend').last();
                $fileInput.val(picture.description);
                $fileInput.focusout(this._handleImageInputBlur.bind(this, 'description', picture.id));
            }

            if (this.props.hasCopyrightField) {
                const $fileInput = $(`#${this.props.id}`).find('.dropzone-copyright').last();
                $fileInput.val(picture.copyright);
                $fileInput.focusout(this._handleImageInputBlur.bind(this, 'copyright', picture.id));
            }
        });
    };

    _handleFileAdded = (file) => {
        if (this.props.onFileAdded) {
            this.props.onFileAdded(file);
        }

        if (this.props.isAutoUploaded) {
            this._isUploading = true;
        }
    };

    _sending = (file, xhr, formData) => {
        let uploadData = this.props.defaultData || {};

        if (this.props.isAutoUploaded) {
            uploadData.model = this.props.dataModel;
            if (this.props.dataModelId) {
                uploadData.model_id = this.props.dataModelId;
            }
        }

        // Remove picture or pictures attributes when sending data
        for (let key in _.omit(uploadData, ['picture', 'pictures'])) {
            let data = uploadData[key];
            formData.append(`${this.props.isAutoUploaded ? 'upload' : this.props.dataModel}[${key}]`, data);
        }

        formData.append('authenticity_token', $('meta[name="csrf-token"]').attr('content'));
    };

    _error = (file, response, event) => {
        if (this.props.onUploadError) {
            this.props.onUploadError(response);
        }

        if (this.props.hasLegendField || this.props.hasCopyrightField) {
            $(file.previewTemplate).find('textarea').each((index, element) => {
                $(element).hide();
            });
        }

        if (this.props.isAutoUploaded) {
            this._isUploading = true;
        }
    };

    _success = (file, data, event) => {
        if (this.props.onUploadSuccess) {
            this.props.onUploadSuccess(data);
        }

        const uploadId = data && data.upload && data.upload.id;

        if (this.props.isAutoUploaded) {
            this._isUploading = false;
            this._filesUploaded.push(uploadId);
            $(file.previewTemplate).find('input').val(uploadId);

            $(file.previewTemplate).find('.dz-remove').attr('id', uploadId);
        }

        if (this.props.hasLegendField) {
            const $legendInput = $(file.previewTemplate).find('.dropzone-legend');
            $legendInput.focusout(this._handleImageInputBlur.bind(this, 'description', uploadId));
        }

        if (this.props.hasCopyrightField) {
            const $copyrightInput = $(file.previewTemplate).find('.dropzone-copyright');
            $copyrightInput.focusout(this._handleImageInputBlur.bind(this, 'copyright', uploadId));
        }

        $(ReactDOM.findDOMNode(this)).find('.dropzone').removeClass('dropzone-no-pictures');
    };

    // Remove from dropzone preview
    _handleFileRemoved = (file) => {
        const uploadId = $(file.previewTemplate).find('.dz-remove').attr('id') || file.id;

        if (uploadId) {
            UploadActions.deleteUpload(uploadId);

            if (this.props.isAutoUploaded) {
                this._isUploading = true;
            }

            this._filesUploaded.remove(parseInt(uploadId, 10));

            if (this._filesUploaded.length === 0) {
                $(ReactDOM.findDOMNode(this)).find('.dropzone').addClass('dropzone-no-pictures');
            }

            if (this.props.onUploadRemove) {
                this.props.onUploadRemove(uploadId);
            }
        }
    };

    _handleImageInputBlur = (field, uploadId, event) => {
        const value = event.currentTarget.value;

        if (uploadId) {
            let newUpload = {
                id: uploadId
            };

            newUpload[field] = value;

            if (this.props.dataModelId) {
                newUpload.model_id = this.props.dataModelId;
            }

            UploadActions.updateUpload(newUpload);

            this._isUploading = true;
        }

        return event;
    };

    isUploading = () => {
        return this._isUploading;
    };

    getFilesId = () => {
        return this._filesUploaded;
    };

    render() {
        const eventHandlers = {
            init: this._initDropZone,
            addedfile: this._handleFileAdded,
            removedfile: this._handleFileRemoved,
            sending: this._sending,
            error: this._error,
            success: this._success
        };

        let maxFileSize = window.parameters.image_size / (1024 * 1024);
        if (this.props.acceptedFiles && this.props.maxFileSize) {
            maxFileSize = this.props.maxFileSize;
        }

        const djsConfig = {
            method: this.props.method,
            paramName: `${this.props.isAutoUploaded ? 'upload' : this.props.dataModel}[${this.props.dataName}${this.props.isMultipleFilesUploaded ? 's' : ''}]`,
            autoProcessQueue: this.props.isAutoUploaded,
            addRemoveLinks: this.props.hasRemoveLinks,
            maxFiles: this.props.maxFiles,
            maxFilesize: maxFileSize,
            acceptedFiles: this.props.acceptedFiles || 'image/*',
            clickable: true,
            uploadMultiple: this.props.isMultipleFilesUploaded,
            dictDefaultMessage: '<i class="material-icons">cloud_upload</i>' + (this.props.dropZoneMessage || I18n.t('js.drop_zone.default_message')),
            dictCancelUpload: I18n.t('js.drop_zone.cancel'),
            dictCancelUploadConfirmation: I18n.t('js.drop_zone.confirm_cancel'),
            dictRemoveFile: I18n.t('js.drop_zone.remove'),
            dictFallbackMessage: I18n.t('js.drop_zone.error.unsupported_browser'),
            dictFallbackText: null,
            dictInvalidFileType: I18n.t('js.drop_zone.error.extension'),
            dictFileTooBig: I18n.t('js.drop_zone.error.size', {
                filesize: '{{filesize}}',
                maxFileSize: '{{maxFilesize}}'
            }),
            dictResponseError: I18n.t('js.drop_zone.error.server'),
            thumbnailHeight: 160,
            thumbnailWidth: 160,
            previewTemplate: ReactDOMServer.renderToStaticMarkup(
                <div className="dz-preview dz-file-preview">
                    <div className="dz-image"><img data-dz-thumbnail={true}/></div>
                    <div className="dz-details">
                        <div className="dz-size" data-dz-size={true}></div>
                        <div className="dz-filename"><span data-dz-name={true}/></div>
                    </div>
                    <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress={true}/></div>
                    <div className="dz-error-message"><span data-dz-errormessage={true}/></div>
                    <div className="dz-success-mark"><span>✔</span></div>
                    <div className="dz-error-mark"><span>✘</span></div>

                    {
                        this.props.isAutoUploaded &&
                        <input type="hidden"
                               name={`${this.props.dataModel}[pictures][]`}/>
                    }

                    {
                        this.props.hasLegendField &&
                        <div className="input-field">
                            <textarea type="text"
                                      className="materialize-textarea dropzone-legend"
                                      placeholder={this.props.imageInputPlaceholder}/>
                        </div>
                    }

                    {
                        this.props.hasCopyrightField &&
                        <div className="input-field">
                            <textarea type="text"
                                      className="materialize-textarea dropzone-copyright"
                                      placeholder={I18n.t('js.drop_zone.copyright_message')}/>
                        </div>
                    }
                </div>
            )
        };

        const componentConfig = {
            showFiletypeIcon: false,
            postUrl: this.props.uploadUrl
        };

        return (
            <div id={this.props.id}
                 className={classNames('center-align', this.props.className)}>
                <DropZoneComponent className={classNames({'dropzone-no-pictures': !this.props.serverFiles})}
                                   config={componentConfig}
                                   eventHandlers={eventHandlers}
                                   djsConfig={djsConfig}>
                    {this.props.children}
                </DropZoneComponent>
            </div>
        );
    }
}



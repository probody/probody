import React from "react";
import css from '../../../styles/kit/forms/imageinput.module.scss';
import Numbers from "../../../helpers/Numbers.js";
import Button from "../Button.jsx";
import PropTypes from "prop-types";
import {GlobalContext} from "../../../contexts/Global.js";
import {cnb} from "cnbuilder";
import APIRequests from "../../../helpers/APIRequests.js";
import Image from "next/image";

export default class ImageInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            preview: '',
            uploaded: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.deletePic = this.deletePic.bind(this);
    }

    static contextType = GlobalContext

    static propTypes = {
        onUpload: PropTypes.func.isRequired,
        url: PropTypes.string
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url && this.props.url.length > 0) {
            this.setState({preview: this.props.url, uploaded: true})
        }
    }

    componentDidMount() {
        if (this.props.url && this.props.url.length > 0) {
            this.setState({preview: this.props.url, uploaded: true})
        }
    }

    async handleChange(e) {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            this.setState({uploaded: false});

            reader.onload = function (ev) {
                this.setState({preview: ev.target.result});
            }.bind(this);

            reader.readAsDataURL(e.target.files[0]);

            try {
                await APIRequests.uploadPic(e.target.files[0], this.state.preview.startsWith('https://probody.kz') ? this.state.preview.replace('https://probody.kz/pic/', '') : undefined).then(async res => {
                    if (res.status === 200) {
                        const newImageURL = 'https://probody.kz/pic/' + await res.text()

                        this.setState({uploaded: true, preview: newImageURL});
                        this.props.onUpload(newImageURL);
                    } else {
                        this.setState({uploaded: false, preview: ''})
                    }
                })
            } catch (e) {
                this.setState({uploaded: false, preview: ''})
            }

            e.target.value = ''
        }
    }

    deletePic() {
        this.setState({uploaded: false, preview: ''})
        this.props.onUpload('')
    }

    render() {
        const inputId = 'image-input-' + Numbers.random(0, 99999),
            inputRef = React.createRef(),
            {theme} = this.context

        return <div className={cnb(css['theme--' + theme], 'grid', 'relative')}>
            <label className={'inline-block'} htmlFor={inputId}>
                <div className={css.root}>
                    {this.state.preview ? <img height={220} className={cnb(css.thumb, this.state.uploaded ? '' : css.uploading)}
                                               src={this.state.preview}/> : ' '}
                </div>
            </label>

            {this.state.uploaded && <Button color={'tertiary'} className={css.delete} focus={false} size={'x-small'}
                                            iconLeft={'trashcan'} onClick={this.deletePic}/>}

            <Button className={this.state.preview ? css.edit : css.plus} focus={false} size={'x-small'}
                    iconLeft={this.state.preview ? 'edit' : 'plus'} mapClick={inputRef}/>

            <input accept="image/png, image/jpg, image/jpeg" onChange={this.handleChange} ref={inputRef} type='file'
                   id={inputId} className={'d-none'}/>
        </div>
    }
}

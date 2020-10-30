import React from 'react';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import { Storage } from 'aws-amplify';
import Dimensions from 'Dimensions';


export default class CachedImage extends React.Component {
  _isMounted = false;

  state = {
    preview: null,
    image: null,
    style: null,
  }

  componentDidMount(){
    this._isMounted = true;

    const preview = this.props.preview || null;
    const s3Image = this.props.s3Image || null;
    const style = this.props.style || null;

    this.setState({preview, style});
    if (!!s3Image) this.getOrSetImageCache(s3Image);    
  }

  componentDidUpdate(prevProps) {
    if(this.props.s3Image !== prevProps.s3Image){
      const s3Image = this.props.s3Image || null;
      if (!!s3Image) this.getOrSetImageCache(s3Image);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getOrSetImageCache = async (s3Image) => {
    height = Dimensions.get('window').height;
    width = Dimensions.get('window').width;
    
    if (!!s3Image.thumbSmall &&
        s3Image.thumbSmall.width >= width &&
        s3Image.thumbSmall.height >= height) {
      key = s3Image.thumbSmall.key;
    }
    else if (!!s3Image.thumbMedium &&
              s3Image.thumbMedium.width >= width &&
              s3Image.thumbMedium.height >= height) {
      key = s3Image.thumbMedium.key;
    }
    else if (!!s3Image.thumbLarge &&
              s3Image.thumbLarge.width >= width &&
              s3Image.thumbLarge.height >= height) {
      key = s3Image.thumbLarge.key;
    }
    else {
      key = s3Image.fullsize.key;
    }

    path = key.slice(key.lastIndexOf("/") + 1)

    // let path = uri.slice(0, uri.indexOf("?"))
    // path = path.slice(path.lastIndexOf("/") + 1)

    FileSystem.getInfoAsync(FileSystem.cacheDirectory + path).then((data) => {
      if (data.exists && this._isMounted) {
        this.setState({image: data.uri});
      } else {
        Storage
        .get(path, {level: 'public'})
        .then((uri) => {
          FileSystem.downloadAsync(uri, FileSystem.cacheDirectory + path)
          .then((data) => {
            if (this._isMounted)
              this.setState({image: data.uri})
          });
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <Image source={!!this.state.image ? { uri: this.state.image } : this.state.preview }
             style={this.state.style}/>
    );
  }
}
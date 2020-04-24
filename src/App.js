import React from "react";
import "./App.css";
import Button from "@material-ui/core/Button";
import Constants from "./helpers/constants";
import { fetchFromFlickrApi } from "./helpers/api";
import { InputSearch } from "./Component/InputSearch";
import { ShowImages } from "./Component/ShowImages";

const ApiKey = Constants.FLICKR_IMAGE_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSearched: "",
      imageData: [],
      page: "",
      showMoreImages: false,
    };
  }

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState(
      {
        imageSearched: e.target.value,
      },
      () => {
        const url = `/services/rest/?method=flickr.photos.search&api_key=${ApiKey}&format=json&nojsoncallback=1&safe_search=1&text=${this.state.imageSeached}`;
        fetchFromFlickrApi(url).then((res) => {
          if (res.data.photos) {
            const imageData = res.data.photos.photo;
            const page = res.data.photos.page;
            this.setState({
              imageData: imageData,
              page: page,
            });
          } else if (this.state.imageSearched === "") {
            this.setState({ imageData: [], page: "" });
          }
        });
      }
    );
  };

  handleMoreImagesClick = (e) => {
    const { page } = this.state;
    const url = `/services/rest/?method=flickr.photos.search&api_key=${ApiKey}&format=json&nojsoncallback=1&safe_search=1&text=${
      this.state.imageSeached
    }&page=${page + 1}`;
    fetchFromFlickrApi(url).then((res) => {
      if (res.data.photos) {
        const imageData = res.data.photos.photo;
        const page = res.data.photos.page;
        this.setState({
          imageData: [...this.state.imageData, ...imageData],
          page: page,
        });
      }
    });
  };

  render() {
    console.log("Environment Variables", process.env);
    const { imageSearched, imageData, showMoreImages } = this.state;
    return (
      <div>
        <h1 className="header">Image Search</h1>
        <div className="search">
          <InputSearch
            handleChange={this.handleInputChange}
            value={imageSearched}
          />
        </div>
        <div className="showImageData">
          {imageData && <ShowImages imageData={imageData} />}
        </div>
        <div className="button">
          {imageData.length !== 0 && !showMoreImages && (
            <Button
              variant="contained"
              onClick={this.handleMoreImagesClick}
              color="primary"
              href="#contained-buttons"
            >
              Load More Images
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default App;

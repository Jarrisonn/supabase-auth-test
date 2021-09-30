import React, { Component } from "react";
import supabase from "./supabase";
class Image extends Component {
  constructor(props) {
    super(props);


    this.state = {
      imageList: [],
      loading: true,
      session: null,
    };
    this.onChange = this.onChange.bind(this);
  }
  async componentDidMount() {
     
      this.setState({
          session: this.props.session,
      })

      
          const { data, geterror } = await supabase.storage
            .from(this.props.session.user.id)
            .list("2");
          console.log(data);
      

    let urlArray = []
    for (let index = 1; index < data.length; index++) {
        const { publicURL, urlerror } = supabase.storage
          .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
          .getPublicUrl(`2/${data[index].name}`);
        urlArray.push(publicURL)   
    }

    console.log(urlArray);


  }

  async onChange(event) {
    let file = event.target.files[0];
    let url = URL.createObjectURL(file);
    console.log(file.name);
    console.log(url);
    this.setState(
      {
        imageList: [...this.state.imageList, url],
        loading: false,
      },
      () => {
        console.log(this.state.imageList);
      }
    ); 

    //upload files to supabase storage
    const { uploaddata, error } = await supabase.storage
      .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
      .upload(`3/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    //get files
    const { data, geterror } = await supabase.storage
      .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
      .list("2");
    console.log(data);

    const { publicURL, urlerror } = supabase.storage
      .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
      .getPublicUrl("2");
    console.log(publicURL);
  }
  render() {
    return (
      <div>
        <form>
          <input
            style={{ cursor: "pointer", backgroundColor: "red" }}
            name="image"
            onChange={(event) => this.onChange(event)}
            accept="image/*"
            id="icon-button-file"
            type="file"
            capture="environment"
          />
        </form>
        {this.state.loading && <div>Loading image...</div>}
        {!this.state.loading && (
          <div>
            {this.state.imageList.map((image, index) => (
              <div key={index}>
                <img src={image} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Image;

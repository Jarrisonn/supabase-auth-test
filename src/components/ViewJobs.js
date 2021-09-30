import React, { Component } from "react";
import supabase from "./supabase";
import CreateJob from "./CreateJob";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      loading: true,
      session: null,
      hidden: false,
      sprayaway: false,
      createJob: false,
    };

    this.addJob = this.addJob.bind(this);
    this.getJob = this.getJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.getImages = this.getImages.bind(this);
    this.getCar = this.getCar.bind(this)
    this.sendToJobs = this.sendToJobs.bind(this)
  }

  async componentDidMount() {
    let { data, error } = await supabase.from("job").select("*");

    if (error) {
      alert(error.message);
    }
    this.setState(
      {
        data: data,
        loading: false,
        session: this.props.session,
      },
      () => {
        console.log(this.state);
        console.log(this.state.session.user.email);
        if (this.state.session.user.email.includes("@sprayaway.com")) {
          this.setState(
            {
              sprayaway: true,
            },
            () => {
              console.log(this.state);
            }
          );
        }
      }
    );

    let carData = [...data];
    console.log(carData);

    const Job = supabase
      .from("job")
      .on("*", (payload) => {
        console.log("Change received!", payload);

        if (payload.eventType === "INSERT") {
          console.log("insert");
          this.setState({
            data: [...this.state.data, payload.new],
          });
        }

        if (payload.eventType === "DELETE") {
          console.log("DELETE operation");
          let newdata = [...this.state.data];
          newdata.forEach((car, index) => {
            if (car.id === payload.old.id) {
              console.log(`car found at: ${index}`);
              let removed = newdata.splice(index, 1);
              console.log(removed);
            }
            console.log(newdata);
          });

          this.setState({
            data: newdata,
          });
        }
      })
      .subscribe();

    // Use the JS library to create a bucket.

    
  }

  addJob(event) {
    event.preventDefault();
    console.log("job button");
    this.setState({
      hidden: true,
      createJob: true,
    });
  }

  getJob() {
    console.log("getjob called");
    this.setState({
      createJob: false,
      hidden: false,
    });
  }
  async deleteJob(event, index) {
    event.preventDefault();

    const { data, error } = await supabase
      .from("job")
      .delete()
      .eq("jobid", String(this.state.data[index].jobid));
  }

  async getImages(event) {
    //c1640c5d-7b58-43dd-94a3-90e31b63062d

  

    let file = event.target.files[0];
    // let url = URL.createObjectURL(file);
    // console.log(file.name);
    // console.log(url);
    // this.setState(
    //   {
    //     imageList: [...this.state.imageList, url],
    //     loading: false,
    //   },
    //   () => {
    //     console.log(this.state.imageList);
    //   }
    // );


    // const { data, geterror } = await supabase.storage
    //         .from(this.props.session.user.id)
    //         .list("2");
    //       console.log(data);
      

    // let urlArray = []
    // for (let index = 1; index < data.length; index++) {
    //     const { publicURL, urlerror } = supabase.storage
    //       .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
    //       .getPublicUrl(`2/${data[index].name}`);
    //     urlArray.push(publicURL)   
    // }

    // console.log(urlArray);



    let data = [...this.state.data]
    console.log(data);
    data.forEach((car, index) => {
      
      console.log(car.id);
    })
    
    //upload files to supabase storage
    const { uploaddata, error } = await supabase.storage
      .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
      .upload(`3/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });




    // //get files
    // const { data, geterror } = await supabase.storage
    //   .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
    //   .list("2");
    // console.log(data);

    // const { publicURL, urlerror } = supabase.storage
    //   .from("c1640c5d-7b58-43dd-94a3-90e31b63062d")
    //   .getPublicUrl("2");
    // console.log(publicURL);
  }

  getCar(car){
    console.log(car);
    

  }
  sendToJobs(array){
    console.log(`called`);
    console.log(array);
  }

  render() {
    return (
      <div>
        {this.state.loading && <div>Loading...</div>}
        {!this.state.hidden && (
          <div>
            <h2>Your Jobs: </h2>
            <button onClick={(event) => this.addJob(event)}>Add Job</button>
            {!this.state.hidden &&
              !this.state.loading &&
              this.state.data.map((car, index) => (
                <div className="job" key={car.jobid}>
                  <p>Make: {car.car_make}</p>
                  <p>Model: {car.car_model}</p>
                  <p>Reg Number: {car.car_reg}</p>
                  <p>{car.DeliveryMethod}</p>
                  <p>Time requested: {car.time_requested}</p>
                  <p>Job Descripton: {car.description}</p>
                  {!car.delivery && !this.state.sprayaway && (
                    <div>You have requested the car to be collected</div>
                  )}
                  {car.delivery && !this.state.sprayaway && (
                    <div>
                      You have requested that you deliver the car to the unit
                    </div>
                  )}
                  {this.state.sprayaway && (
                    <div>
                      <button>SPRAYAWAY ONLY BUTTON</button>
                    </div>
                  )}
                  <button onClick={(event) => this.deleteJob(event, index)}>
                    Delete Job
                  </button>
                  <button onClick={this.getCar(car)}>get car</button>
                </div>
              ))}
          </div>
        )}
        {this.state.createJob && (
          <CreateJob getJob={this.getJob} session={this.state.session} sendToJobs={this.sendToJobs}/>
        )}
      </div>
    );
  }
}

export default App;

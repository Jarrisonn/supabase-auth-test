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
      images: [],
    };

    this.addJob = this.addJob.bind(this);
    this.getJob = this.getJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.getCar = this.getCar.bind(this);
    this.sendToJobs = this.sendToJobs.bind(this);
    this.updateJobs = this.updateJobs.bind(this);
    this.getImages = this.getImages.bind(this);
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
          this.updateJobs();
          
        }
      })
      .subscribe();

      this.getImages();
  }
  async updateJobs(){
    let { data, error } = await supabase.from("job").select("*");
    this.setState({
      data: data
    })
    this.getImages();
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

    console.log(index);
    const { data, error } = await supabase
      .from("job")
      .delete()
      .eq("jobid", String(this.state.data[index].jobid));

  }


  getCar(car){
    console.log(car);
    

  }
  sendToJobs(array){
    console.log(`called`);
    console.log(array);
  }
  async getImages(){
    this.setState({
      loading:true,
    })
    let { data: images, imageError } = await supabase
      .from('images')
      .select('*')
      console.log(images);

    console.log('got images');

    let cars = [...this.state.data]
    
    cars.forEach((car, carindex) => {
      car['images'] = []
      images.forEach((image, imageindex) => {
        if(car.jobid === image.jobid){
          car.images = [...car['images'], image.imageurl]
        }
      })
    })
    
    this.setState({
      data: [...cars],
      loading: false,
    }, () => {
      console.log(this.state.data);
    })
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
                  {car.images && car.images.map((image, carindex) => (
                    <div key={carindex}>
                      <img src={image} height='100' width='100'/>
                    </div>
                  ))}
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
          <CreateJob getImages={this.getImages} getJob={this.getJob} session={this.state.session} sendToJobs={this.sendToJobs}/>
        )}
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import supabase from './supabase';
import CreateJob from './CreateJob'
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      loading: true,
      session: null,
      hidden: false,
      sprayaway: false,
      createJob: false,

    }


    this.addJob = this.addJob.bind(this)
    this.getJob = this.getJob.bind(this)
    this.deleteJob = this.deleteJob.bind(this)
    this.getImages = this.getImages.bind(this)
  }

  async componentDidMount() {
    let { data, error } = await supabase
      .from('job')
      .select('*')

    if (error) {
      alert(error.message)
    }
    this.setState({
      data: data,
      loading: false,
      session: this.props.session,
    }, () => {
      console.log(this.state);
      console.log(this.state.session.user.email);
      if (this.state.session.user.email.includes("@sprayaway.com")) {
        this.setState({
          sprayaway: true,
        }, () => {
          console.log(this.state);
        })
      }
    })

    let carData = [...data]
    console.log(carData);

    

    const Job = supabase
      .from('job')
      .on('*', payload => {
        console.log('Change received!', payload)

        if (payload.eventType === "INSERT") {
          console.log('insert');
          this.setState({
            data: [...this.state.data, payload.new]
          })
        }

        if (payload.eventType === "DELETE") {
          console.log('DELETE operation');
          let newdata = [...this.state.data]
          newdata.forEach((car, index) => {
            if (car.id === payload.old.id) {
              console.log(`car found at: ${index}`);
              let removed = newdata.splice(index, 1)
              console.log(removed);
            }
            console.log(newdata);
          })

          this.setState({
            data: newdata,
          })
        }
      })
      .subscribe()

    // Use the JS library to create a bucket.

    

    

    this.getImages();
  }

  addJob(event) {

    event.preventDefault();
    console.log('job button');
    this.setState({
      hidden: true,
      createJob:true,
    })
  }

  getJob(){
    console.log('getjob called');
    this.setState({
      createJob: false,
      hidden: false,
    })
  }
  async deleteJob(event,index){

    event.preventDefault()

    const { data, error } = await supabase
    .from('job')
    .delete()
    .eq('id', String(this.state.data[index].id))
    

  }

  async getImages(){
    //c1640c5d-7b58-43dd-94a3-90e31b63062d
    const { publicURL, error } = supabase
    .storage
    .from('c1640c5d-7b58-43dd-94a3-90e31b63062d')
    .getPublicUrl('2')
   
    //https://tupufqoprwlcjhwoaqzd.supabase.in/storage/v1/object/public/c1640c5d-7b58-43dd-94a3-90e31b63062d/2/koke-mayayo-thevisualkiller-uG8RGApPGWk-unsplash.jpg
    console.log(publicURL);

    

    const { listdata, eorrerror } = await supabase
    .storage
    .from('c1640c5d-7b58-43dd-94a3-90e31b63062d')
    .list('/public/2/c1640c5d-7b58-43dd-94a3-90e31b63062d')
    console.log(listdata);
    
    
  }


  render() {
    return (

      <div>
        {this.state.loading &&
          <div>
            Loading...
          </div>}
        {!this.state.hidden && <div>
          <h2>Your Jobs: </h2>
          <button onClick={event => this.addJob(event)}>Add Job</button>
          {!this.state.hidden && !this.state.loading && this.state.data.map((car, index) => (
            <div className='job' key={index}>
              <p>Make: {car.car_make}</p>
              <p>Model: {car.car_model}</p>
              <p>Reg Number: {car.car_reg}</p>
              <p>{car.DeliveryMethod}</p>
              <p>Time requested: {car.time_requested}</p>
              <p>Job Descripton: {car.description}</p>
              {!car.delivery && !this.state.sprayaway &&
              <div>
                You have requested the car to be collected
              </div>
              }
              {car.delivery && !this.state.sprayaway && 
              <div>
                You have requested that you deliver the car to the unit
              </div>
              }
              {this.state.sprayaway &&
                <div>
                  <button>SPRAYAWAY ONLY BUTTON</button>
                </div>
              }
                <button onClick={event => this.deleteJob(event,index)}>Delete Job</button>
            </div>
          ))}
        </div>}
        {this.state.createJob && 
        <CreateJob getJob={this.getJob} session={this.state.session}/>
        }
        
      </div>

    );
  }
}

export default App;

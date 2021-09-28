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
  render() {
    return (

      <div>
        {this.state.loading &&
          <div>
            Loading...
          </div>}
        {!this.state.hidden && <div>
          <button onClick={event => this.addJob(event)}>Add Job</button>
          <h2>Your Jobs: </h2>
          {!this.state.hidden && !this.state.loading && this.state.data.map((car, index) => (
            <div className='job' key={index}>
              <p>Make: {car.car_make}</p>
              <p>Model: {car.car_model}</p>
              <p>Reg Number: {car.car_reg}</p>
              <p>{car.DeliveryMethod}</p>
              <p>Time requested: {car.time_requested}</p>
              <p>Job Descripton: {car.Description}</p>
              {!car.painterid &&
                <div>
                  <p>Job not taken yet</p>
                  {this.state.sprayaway &&

                    <button>Take Job</button>
                  }
                </div>}
              {this.state.sprayaway &&
                <div>
                  <button>SPRAYAWAY ONLY BUTTON</button>
                </div>}
                <button onClick={event => this.deleteJob(event,index)}>X</button>
            </div>
          ))}
        </div>}
        {this.state.createJob && 
        <CreateJob getJob={this.getJob} session={this.state.session}/>
        }
        <button onClick={() => this.setState({ hidden: !this.state.hidden, createJob: !this.state.createJob })}>Hide Jobs</button>
      </div>

    );
  }
}

export default App;

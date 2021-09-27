import React, { Component } from 'react';
import supabase from './supabase';
class App extends Component {
  constructor(props){
    super(props)

    this.dbChange = this.dbChange.bind(this);

    this.state = { 
        data: null,
        loading: true,
        session: null,
        hidden: false,
        sprayaway: false,
    }
  }
  
  async componentDidMount(){
    let { data, error } = await supabase
    .from('job')
    .select('*')

    this.setState({
      data: data,
      loading: false,
      session: this.props.session,
    }, () => {
      console.log(this.state);
      console.log(this.state.session.user.email);
      if(this.state.session.user.email.includes("@sprayaway.com")){
        this.setState({
          sprayaway: true,
        }, () => {
          console.log(this.state.sprayaway);
        })
      }
    })


// const Job = supabase
// .from('Job')
// .on('*', payload => {
//   console.log('Change received!', payload)
 
//   if(payload.eventType === "INSERT"){
//     console.log('insert');
//     this.setState({
//       data: [...this.state.data, payload.new]
//     })
//   }
  
//   if(payload.eventType === "DELETE"){
//     console.log('DELETE operation');
//     let newdata = [...this.state.data]
//     newdata.forEach((car,index) => {
//       if(car.JobId === payload.old.JobId){
//         console.log(`car found at: ${index}`);
//         let removed = newdata.splice(index,1)
//         console.log(removed);
//       }
//       console.log(newdata);
//     })
    
//     this.setState({
//       data: newdata,
//     })
//   }
// })
//   .subscribe()


// let { data: JobName, newerror } = await supabase
// .from('Job')
// .select(`
//   *,
//   User (
//     UserId,
//     Name
//   )
// `)
// console.log(JobName);





  }

  dbChange(){

  }
  render() {
    return (
    
        <div>
          {this.state.loading && 
          <div>
            Loading...
          </div>}
          {!this.state.hidden && !this.state.loading && this.state.data.map((car, index) => (
            <div className='job' key={index}>
              <p>Make: {car.car_make}</p>
              <p>Model: {car.car_model}</p>
              <p>Reg Number: {car.car_reg}</p>
              <p>{car.DeliveryMethod}</p>
              <p>Time requested: {car.time_requested}</p>
              <p>Job Descripton: {car.Description}</p>
              {!car.PainterID && 
              <div>
                <p>Job not taken yet</p>
              </div>}
              {this.state.sprayaway && 
              <div>
                <button>SPRAYAWAY ONLY BUTTON</button>
              </div>}
            </div>
          ))}
          <button onClick={() => this.setState({hidden: !this.state.hidden})}>Hide Jobs</button>
        </div>
     
    );
  }
}

export default App;

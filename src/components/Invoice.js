import React, { Component } from "react";
import { format } from "date-fns";
import supabase from "./supabase";
class Invoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      car: null,
      loading: true,
      printing: false,
    };

    this.print = this.print.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }
  componentDidMount() {
    this.setState(
      {
        car: this.props.car,
        loading: false,
      },
      () => {
        console.log(this.state.car);
        console.log(this.props);
      }
    );
  }
  async print() {
    await this.props.showInvoice();
    this.setState({
        printing: true,
    })
    window.print();
    this.props.showInvoice();
    this.setState({
        printing: false,
    })
  }
 async sendEmail(event, car) {
    console.log(car);
    
    let { data: user, error } = await supabase
    .from('user')
    .select('*')
    .eq("id", `${car.userid}`)
    console.log(user[0].email);
    

    console.log(user);
    window.open(
      `mailto:${user[0].email}?subject=Sprayaway Invoice: ${car.jobid}&body=Make: ${car.car_make}%0D%0AModel: ${car.car_model}%0D%0AReg Number: ${car.car_reg}
      `
    );
  }
  render() {
    let car = this.state.car;
    return (
      <div>
        <div>
          {this.state.loading && <p>Loading car...</p>}
          {!this.state.loading && (
            <div>
              <h2>Job ID: {car.jobid}</h2>
              <p>Make: {car.car_make}</p>
              <p>Make: {car.car_make}</p>
              <p>Model: {car.car_model}</p>
              <p>Reg Number: {car.car_reg}</p>

              <p>Time requested: {car.time_requested}</p>
              <p>Job Descripton: {car.description}</p>
              <p>
                Job Creation date:{" "}
                {format(new Date(car.created_at), "dd/MM/yyy")}
              </p>
              {car.images.map((image, index) => (
                <div>
                  <img src={image} width="200" height="200" />
                </div>
              ))}
            </div>
          )}
        </div>
        {!this.state.printing && <div>
          <button onClick={this.props.closeInvoice}>X</button>
          <button onClick={this.print}>Print</button>
          <button onClick={(event) => this.sendEmail(event, car)}>
            Send Invoice as email
          </button>
        </div>}
      </div>
    );
  }
}

export default Invoice;

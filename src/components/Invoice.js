import React, { Component } from "react";
import { format } from "date-fns";
import supabase from "./supabase";
import {Button,Card,Form} from 'react-bootstrap'
import { round } from "mathjs";
class Invoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      car: null,
      loading: true,
      printing: false,
      price: null,
      vatprice: null,
      invoiceFound: false,
    };

    this.print = this.print.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.onChange = this.onChange.bind(this);
    this.calcVat = this.calcVat.bind(this);
    this.saveInvoice = this.saveInvoice.bind(this);
  }
 async componentDidMount() {
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

    
    let { data: invoices, error } = await supabase
    .from('invoice')
    .select('*')
    console.log(invoices);
    invoices.forEach(invoice => {
      if(invoice.jobid === this.state.car.jobid){
        console.log(`invoice has already been created`);
        this.setState({
          invoiceFound: true
        })


      }else{
        console.log(`Invoice has not been created`);
      }
    });

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
  onChange(event){
    this.setState({
      [event.target.name]: event.target.value
    }, () => {
      console.log(this.state);
      this.calcVat(this.state.price)
    })
  }
  calcVat(price){
    price = Number(price)
    let vat = ((price/ 10) * 2);
    let total = price + vat
    return round(total, 2);
  }
 async saveInvoice(){
   

    let vatprice = this.calcVat(this.state.price)

    
  const { data, error } = await supabase
    .from('invoice')
    .insert([
      { jobid: `${this.state.car.jobid}`, price: `${this.state.price}`, vat_price: `${vatprice}` },
    ])

    this.setState({
      invoiceFound: true,
    })

  }


  render() {
    let car = this.state.car;
    return (
      <Card className='d-flex align-items-center border-3 p-3'>
        <div className='text-center'>
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
              {!this.state.printing && car.images.map((image, index) => (
                <div>
                  <img src={image} width="200" height="200" />
                </div>
              ))}

            </div>
          )}
        {!this.state.printing && <Form>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control min='0' type='number' name='price' onChange={event => this.onChange(event)} value={this.state.price}></Form.Control>
            {this.state.price && <p className='mt-2'>Total inc VAT £: {this.calcVat(this.state.price)}</p>}
          </Form.Group>
        </Form>}
        {this.state.printing && 
        <div>
          <p>Price: {`£: ${this.state.price}`}</p>
          <p>Total inc VAT £: {this.calcVat(this.state.price)}</p>
        </div>
        }

        </div>
        {!this.state.printing && <div style={{width: '100%'}} className='d-flex justify-content-around'>
          {this.state.invoiceFound && <p>Invoice has already been created</p>}
          {!this.state.invoiceFound && <Button style={{minWidth: '178px'}} onClick={this.saveInvoice}>Save Invoice</Button>}
          <Button style={{minWidth: '178px'}} onClick={this.print}>Print</Button>
          <Button style={{minWidth: '178px'}}  onClick={(event) => this.sendEmail(event, car)}>
            Send Invoice as email
          </Button>
          <Button style={{minWidth: '178px'}}  onClick={this.props.closeInvoice}>Close Invoice</Button>
        </div>}
      </Card>
    );
  }
}

export default Invoice;

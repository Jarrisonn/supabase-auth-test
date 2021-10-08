import React, { Component } from "react";
import supabase from "./supabase";
import CreateJob from "./CreateJob";
import Invoice from "./Invoice";
import { Container, Button, Card, Image, Carousel } from "react-bootstrap";
import "../styles/viewjobs.css";
import { MdAddBox } from "react-icons/md";
import Invoicelist from "./InvoiceList";
import { isThisSecond } from "date-fns";

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
      invoice: false,
      car: null,
      invoiceListShow: false,
    };

    this.addJob = this.addJob.bind(this);
    this.getJob = this.getJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.getCar = this.getCar.bind(this);
    this.sendToJobs = this.sendToJobs.bind(this);
    this.updateJobs = this.updateJobs.bind(this);
    this.getImages = this.getImages.bind(this);
    this.changeJobStatus = this.changeJobStatus.bind(this);
    this.generateInvoice = this.generateInvoice.bind(this);
    this.closeInvoice = this.closeInvoice.bind(this);
    this.showInvoiceList = this.showInvoiceList.bind(this)
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
              console.log(this.props);
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

        if (payload.eventType === "UPDATE") {
          this.updateJobs();
        }
      })
      .subscribe();

    this.getImages();
  }
  async updateJobs() {
    let { data, error } = await supabase.from("job").select("*");
    this.setState({
      data: data,
    });
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

  getCar(car) {
    console.log(car);
  }
  sendToJobs(array) {
    console.log(`called`);
    console.log(array);
  }
  async getImages() {
    this.setState({
      loading: true,
    });
    let { data: images, imageError } = await supabase
      .from("images")
      .select("*");
    console.log(images);

    console.log("got images");

    let cars = [...this.state.data];

    cars.forEach((car, carindex) => {
      car["images"] = [];
      images.forEach((image, imageindex) => {
        if (car.jobid === image.jobid) {
          car.images = [...car["images"], image.imageurl];
        }
      });
    });

    this.setState(
      {
        data: [...cars],
        loading: false,
      },
      () => {
        console.log(this.state.data);
      }
    );
  }

  async changeJobStatus(event, car) {
    event.preventDefault();
    console.log(event);
    console.log(car);
    if (event.target.name === "accept") {
      console.log(`Accept job clicked on ${car.jobid}`);
      const { accdata, accerror } = await supabase
        .from("job")
        .update({ accepted: "true" })
        .eq(`jobid`, `${car.jobid}`);
    }
    if (event.target.name === "decline") {
      console.log(`Decline job clicked on ${car.jobid}`);
      const { decdata, decerror } = await supabase
        .from("job")
        .update({ accepted: "false" })
        .eq(`jobid`, `${car.jobid}`);
    }
  }

  print() {
    window.print();
  }

  generateInvoice(event, car) {
    this.setState({
      invoice: true,
      hidden: true,
      car: car,
    });
  }

  closeInvoice() {
    this.setState({
      hidden: false,
      invoice: false,
      car: null,
    });
  }

  showInvoiceList(){
    this.setState({
      invoiceListShow: !this.state.invoiceListShow,
      hidden: !this.state.hidden,
    })
  }


  render() {
    return (
      <Container className="d-flex jobcontainer justify-content-center">
        <div>
          {!this.state.hidden && (
            <div className="d-flex flex-column jusify-content-center align-items-center">
              <h2 className="text-center">Your Jobs: </h2>
              {this.state.loading && <div>Loading...</div>}
              <Button
                className="d-flex justify-content-center align-items-center"
                onClick={(event) => this.addJob(event)}
              >
                Add Job
                <MdAddBox
                  style={{ width: 20, height: 20 }}
                  className="text-white"
                />
              </Button>
              {this.state.sprayaway && 
              <Button onClick={this.showInvoiceList}>View Invoices</Button>
              }
              {!this.state.hidden &&
                !this.state.loading &&
                this.state.data.map((car, index) => (
                  <Card
                    style={{minWidth: '540px'}}
                    className="d-flex  job mt-3 p-3 mb-3 border-3"
                    key={car.jobid}
                  >
                    <Card.Title>Job ID: {car.jobid}</Card.Title>
                    <Card.Text>Make: {car.car_make}</Card.Text>
                    <Card.Text>Model: {car.car_model}</Card.Text>
                    <Card.Text>Reg Number: {car.car_reg}</Card.Text>

                    <Card.Text>Time requested: {car.time_requested}</Card.Text>
                    <Card.Text>Job Descripton: {car.description}</Card.Text>
                    <Card.Text>
                      Job Status:{" "}
                      {car.accepted ? "Job Accepted!" : "Job Rejected :("}
                    </Card.Text>
                    <Carousel className="carousel" variant="dark">
                      {car.images &&
                        car.images.map((image, carindex) => (
                          <Carousel.Item
                            style={{ maxWidth: 500, maxHeight: 500 }}
                          >
                            <Image
                              rounded
                              src={image}
                              key={carindex}
                              className="img"
                              height="100%"
                              width="100%"
                            />
                          </Carousel.Item>
                        ))}
                    </Carousel>
                    {!car.delivery && !this.state.sprayaway && (
                      <div>You have requested the car to be collected</div>
                    )}
                    {car.delivery && !this.state.sprayaway && (
                      <div>
                        You have requested that you deliver the car to the unit
                      </div>
                    )}
                    {this.state.sprayaway && (
                      <div className="d-flex justify-content-between m-3">
                        <Button
                          style={{ minWidth: "145px" }}
                          name="accept"
                          onClick={(event) => this.changeJobStatus(event, car)}
                        >
                          Accept Job
                        </Button>
                        <Button
                          className='btn-warning'
                          style={{ minWidth: "145px" }}
                          name="decline"
                          onClick={(event) => this.changeJobStatus(event, car)}
                        >
                          Decline Job
                        </Button>
                        <Button
                          className='btn-success'
                          style={{ minWidth: "145px" }}
                          onClick={(event) => this.generateInvoice(event, car)}
                        >
                          Invoice View
                        </Button>
                      </div>
                    )}
                    <Button
                      className='btn-danger'
                      name="accept"
                      onClick={(event) => this.deleteJob(event, index)}
                    >
                      Delete Job
                    </Button>
                  </Card>
                ))}
            </div>
          )}
          {this.state.createJob && (
            <CreateJob
              getImages={this.getImages}
              getJob={this.getJob}
              session={this.state.session}
              sendToJobs={this.sendToJobs}
            />
          )}
          {this.state.invoice && (
            <Invoice
              car={this.state.car}
              closeInvoice={this.closeInvoice}
              showInvoice={this.props.showInvoice}
            />
          )}
          {this.state.invoiceListShow && 
          <Invoicelist showInvoiceList={this.showInvoiceList}/>}
        </div>
      </Container>
    );
  }
}

export default App;

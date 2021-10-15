import React, { Component } from "react";
import supabase from "./supabase";
import CreateJob from "./CreateJob";
import Invoice from "./Invoice";
import { format } from "date-fns";
import {
  Container,
  Button,
  Card,
  Image,
  Carousel,
  Spinner,
} from "react-bootstrap";
import { MdAddBox } from "react-icons/md";

import Invoicelist from "./InvoiceList";
import { isThisSecond } from "date-fns";
import "../styles/viewjobs.css";

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
      unfinishedProfile: false,
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
    this.showInvoiceList = this.showInvoiceList.bind(this);
    this.checkProfile = this.checkProfile.bind(this);
    this.closeInvoiceList = this.closeInvoiceList.bind(this);
  }

  async componentDidMount() {
    let { data, error } = await supabase.from("job").select("*");

    if (error) {
      alert(error.message);
    }
    this.setState(
      {
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

    let { data: users, userserror } = await supabase.from("user").select("*");

    carData.forEach((car) => {
      users.forEach((user) => {
        if (car.userid === user.id) {
          car.user = user;
        }
      });
    });

    this.setState(
      {
        data: carData,
        loading: false,
      },
      () => {
        console.log(this.state);
      }
    );

    this.getImages();
    this.checkProfile();
    this.props.getAddJob(this.addJob);
    this.props.getCloseJob(this.getJob);
    this.props.getSprayaway(this.state.sprayaway);
    this.props.showInvoiceList(this.showInvoiceList);
    this.props.closeInvoiceList(this.closeInvoiceList);
  }
  async updateJobs() {
    let { data, error } = await supabase.from("job").select("*");
    let { data: users, userserror } = await supabase.from("user").select("*");

    let carData = [...data];
    carData.forEach((car) => {
      users.forEach((user) => {
        if (car.userid === user.id) {
          car.user = user;
        }
      });
    });

    this.setState(
      {
        data: carData,
        loading: false,
      },
      () => {
        console.log(this.state);
      }
    );
    this.getImages();
  }

  addJob() {
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

    const { invoicedata, invoicedelerror } = await supabase
      .from("invoice")
      .delete()
      .eq("jobid", String(this.state.data[index].jobid));

    const { data, error } = await supabase
      .from("job")
      .delete()
      .eq("jobid", String(this.state.data[index].jobid));

    this.updateJobs();
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

  showInvoiceList() {
    this.setState({
      invoiceListShow: !this.state.invoiceListShow,
      hidden: !this.state.hidden,
    });
  }
  closeInvoiceList() {
    this.setState({
      invoiceListShow: false,
    });
  }

  async checkProfile() {
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", `${this.state.session.user.id}`);

    console.log(user);
    user.forEach((use) => {
      console.log(use);
      if (
        use.city === null ||
        use.county === null ||
        use.first_name === null ||
        use.last_name === null ||
        use.number === null ||
        use.postcode === null ||
        use.street === null ||
        use.county.length < 3
      ) {
        this.setState(
          {
            unfinishedProfile: true,
          },
          () => {
            console.log(this.state);
            this.props.unfinishedProfile(this.state.unfinishedProfile);
          }
        );
      }
    });
  }

  render() {
    return (
      <Container className="d-flex jobcontainer justify-content-center">
        <div>
          {!this.state.hidden && (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2 className="text-center">Your Jobs: </h2>
              {this.state.unfinishedProfile && (
                <div>
                  <h3>
                    Please fill in your profile by clicking the icon on the top
                    right before you can add any jobs.
                  </h3>
                </div>
              )}
              {this.state.loading && (
                <Spinner className="my-3" animation="border"></Spinner>
              )}
              <div className="d-flex flex-row w-100 justify-content-around addinvdiv">
                {!this.state.unfinishedProfile && !this.state.loading && (
                  <Button
                    style={{ width: "127px" }}
                    className="d-flex justify-content-center align-items-center"
                    onClick={(event) => this.addJob(event)}
                  >
                    Add Job
                    <MdAddBox
                      style={{ width: 20, height: 20 }}
                      className="text-white ms-1"
                    />
                  </Button>
                )}
                {this.state.sprayaway && (
                  <Button
                    style={{ width: "127px" }}
                    onClick={this.showInvoiceList}
                  >
                    View Invoices
                  </Button>
                )}
              </div>
              <div className="d-flex flex-wrap justify-content-around">
                {!this.state.hidden &&
                  !this.state.loading &&
                  this.state.data &&
                  this.state.data.map((car, index) => (
                    <Card
                      style={{
                        backgroundColor: "transparent",
                      }}
                      className="d-flex text-center job mt-3 p-3 mb-3 border-3"
                      key={car.jobid}
                    >
                      <Card.Title>Job ID: {car.jobid}</Card.Title>
                      <div className="d-flex flex-column flex-md-row ">
                        <div className="d-flex w-100 justify-content-center align-items-center flex-column text-center">
                          <Card.Title>Car Details</Card.Title>
                          <Card.Text>Make: {car.car_make}</Card.Text>
                          <Card.Text>Model: {car.car_model}</Card.Text>
                          <Card.Text>Reg Number: {car.car_reg}</Card.Text>
                          <Card.Text>
                            Date of Job Creation:{" "}
                            {format(new Date(car.created_at), "dd/MM/yyyy")}
                          </Card.Text>
                          <Card.Text>
                            Date requested:{" "}
                            {format(new Date(car.date_requested), "dd/MM/yyyy")}
                          </Card.Text>
                          <Card.Text>
                            Time requested: {car.time_requested}
                          </Card.Text>
                          <Card.Text>
                            Job Descripton: {car.description}
                          </Card.Text>
                          <Card.Text>
                            Job Accepted Status:{" "}
                            {car.accepted ? "Job Accepted!" : "Job Rejected :("}
                          </Card.Text>
                          {car.accepted && (
                            <Card.Text>
                              Job Completion Status:{" "}
                              {car.completed
                                ? "Job Completed and will be returned asap"
                                : "Job currently Being Worked on"}
                            </Card.Text>
                          )}
                          {!car.delivery && !this.state.sprayaway && (
                            <div>
                              You have requested the car to be collected
                            </div>
                          )}
                          {car.delivery && !this.state.sprayaway && (
                            <div>
                              You have requested that you deliver the car to the
                              unit
                            </div>
                          )}
                        </div>
                        {this.state.sprayaway && (
                          <div className="d-flex mt-3 mt-md-0 w-100 flex-column text-center">
                            <Card.Title>User Details</Card.Title>
                            <Card.Text>
                              Name:{" "}
                              {`${car.user.first_name} ${car.user.last_name}`}
                            </Card.Text>
                            <Card.Text>Number: {car.user.number}</Card.Text>
                          </div>
                        )}
                      </div>
                      <div className='d-flex justify-content-center'>
                        <Carousel className="mt-3 d-" variant="dark">
                          {car.images &&
                            car.images.length !== 0 &&
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
                      </div>
                      {this.state.sprayaway && (
                        <div className="d-flex justify-content-between m-3">
                          <Button
                            style={{ minWidth: "145px" }}
                            name="accept"
                            onClick={(event) =>
                              this.changeJobStatus(event, car)
                            }
                          >
                            Accept Job
                          </Button>
                          <Button
                            className="btn-warning"
                            style={{ minWidth: "145px" }}
                            name="decline"
                            onClick={(event) =>
                              this.changeJobStatus(event, car)
                            }
                          >
                            Decline Job
                          </Button>
                          <Button
                            className="btn-success"
                            style={{ minWidth: "145px" }}
                            onClick={(event) =>
                              this.generateInvoice(event, car)
                            }
                          >
                            Invoice View
                          </Button>
                        </div>
                      )}
                      {this.state.sprayaway && 
                      <Button>
                        Edit Job
                      </Button>
                      }
                      <Button
                        className="btn-danger"
                        name="accept"
                        onClick={(event) => this.deleteJob(event, index)}
                      >
                        Delete Job
                      </Button>
                    </Card>
                  ))}
              </div>
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
          {this.state.invoiceListShow && (
            <Invoicelist showInvoiceList={this.showInvoiceList} />
          )}
        </div>
      </Container>
    );
  }
}

export default App;

import React, { Component } from "react";
import "../styles/createjob.css";
import supabase from "./supabase";
import { v4 as uuidv4 } from "uuid";
import { Form, Button } from "react-bootstrap";
class CreateJob extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      make: "",
      model: "",
      reg: "",
      time: "",
      description: "",
      images: [],
      jobid: uuidv4(),
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.insertRow = this.insertRow.bind(this);
    this.closeAddJob = this.closeAddJob.bind(this);
    this.insertImageTable = this.insertImageTable.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        session: this.props.session,
      },
      () => {
        console.log(this.props);
      }
    );
  }

  onChange(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async onImgChange(event) {
    let file = event.target.files[0];

    //insert images into storage
    const { uploaddata, error } = await supabase.storage
      .from(this.state.session.user.id)
      .upload(`${this.state.jobid}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    //gets urls to store in images table
    const { publicURL, urlerror } = supabase.storage
      .from(this.state.session.user.id)
      .getPublicUrl(`${this.state.jobid}/${file.name}`);

    this.insertImageTable(publicURL);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log("submitted");
    console.log(this.state.session.user.id);

    console.log(this.state);
    this.insertRow();
    this.props.getImages();
    this.props.getJob();
  }

  async insertRow() {
    console.log("row inserted");
    console.log(this.state);

    //insert into jobs table on supabase
    const { data, error } = await supabase
      .from("job")
      .insert([
        {
          jobid: this.state.jobid,
          userid: this.state.session.user.id,
          car_model: this.state.model,
          car_make: this.state.make,
          car_reg: this.state.reg,
          time_requested: this.state.time,
          description: this.state.description,
        },
      ]);
  }
  closeAddJob() {
    this.props.getJob();
  }

  async insertImageTable(url) {
    console.log(url);
    const { imgdata, imgerror } = await supabase
      .from("images")
      .insert([
        {
          userid: this.state.session.user.id,
          imageid: uuidv4(),
          jobid: this.state.jobid,
          imageurl: url,
        },
      ]);
    if (imgerror) {
      console.log(imgerror.message);
    }

    this.setState(
      {
        images: [...this.state.images, url],
      },
      () => {
        console.log(this.state.images);
      }
    );
  }

  render() {
    return (
      <div>
        <Form className="addform" onSubmit={(event) => this.onSubmit(event)}>
          <h2>Add Job Here: </h2>
          <Form.Group>
            <Form.Label htmlFor="make">Car Make:</Form.Label>
            <Form.Select
              name="make"
              value={this.state.make}
              onChange={this.onChange}
            >
              <option value="AC">AC</option>
              <option value="AK">AK </option>
              <option value="Abarth">Abarth </option>
              <option value="Aixam">Aixam </option>
              <option value="Alfa">Alfa Romeo </option>
              <option value="Alpine">Alpine </option>
              <option value="Alvis">Alvis </option>
              <option value="Ariel">Ariel </option>
              <option value="Aston">Aston Martin </option>
              <option value="Audi">Audi </option>
              <option value="Austin">Austin </option>
              <option value="BMW">BMW </option>
              <option value="Beauford">Beauford </option>
              <option value="Bentley">Bentley </option>
              <option value="Bowler">Bowler </option>
              <option value="Bugatti">Bugatti </option>
              <option value="Buick">Buick </option>
              <option value="CUPRA">CUPRA </option>
              <option value="Cadillac">Cadillac </option>
              <option value="Carbodies">Carbodies </option>
              <option value="Caterham">Caterham </option>
              <option value="Chesil">Chesil </option>
              <option value="Chevrolet">Chevrolet </option>
              <option value="Chrysler">Chrysler </option>
              <option value="Citroen">Citroen </option>
              <option value="Corvette">Corvette </option>
              <option value="DS">DS AUTOMOBILES </option>
              <option value="Dacia">Dacia </option>
              <option value="Daewoo">Daewoo </option>
              <option value="Daihatsu">Daihatsu </option>
              <option value="Daimler">Daimler </option>
              <option value="Dax">Dax </option>
              <option value="Dodge">Dodge </option>
              <option value="FSO">FSO </option>
              <option value="Ferrari">Ferrari </option>
              <option value="Fiat">Fiat </option>
              <option value="Ford">Ford </option>
              <option value="GMC">GMC </option>
              <option value="Gardener">Gardener </option>
              <option value="Gentry">Gentry </option>
              <option value="Ginetta">Ginetta </option>
              <option value="Great">Great Wall </option>
              <option value="Holden">Holden </option>
              <option value="Honda">Honda </option>
              <option value="Humber">Humber </option>
              <option value="Hummer">Hummer </option>
              <option value="Hyundai">Hyundai </option>
              <option value="Infiniti">Infiniti </option>
              <option value="Isuzu">Isuzu </option>
              <option value="Iveco">Iveco </option>
              <option value="Jaguar">Jaguar </option>
              <option value="Jeep">Jeep </option>
              <option value="Jensen">Jensen </option>
              <option value="Kia">Kia </option>
              <option value="LEVC">LEVC </option>
              <option value="Lada">Lada </option>
              <option value="Lamborghini">Lamborghini </option>
              <option value="Lancia">Lancia </option>
              <option value="Land">Land Rover </option>
              <option value="Lexus">Lexus </option>
              <option value="Lincoln">Lincoln </option>
              <option value="Locust">Locust </option>
              <option value="London">London Taxis International </option>
              <option value="Lotus">Lotus </option>
              <option value="MG">MG </option>
              <option value="MINI">MINI </option>
              <option value="Mahindra">Mahindra </option>
              <option value="Maserati">Maserati </option>
              <option value="Maybach">Maybach </option>
              <option value="Mazda">Mazda </option>
              <option value="McLaren">McLaren </option>
              <option value="Mercedes">Mercedes-Benz </option>
              <option value="Microcar">Microcar </option>
              <option value="Mitsubishi">Mitsubishi </option>
              <option value="Morgan">Morgan </option>
              <option value="Morris">Morris </option>
              <option value="Naylor">Naylor </option>
              <option value="Nissan">Nissan </option>
              <option value="Noble">Noble </option>
              <option value="Opel">Opel </option>
              <option value="Perodua">Perodua </option>
              <option value="Peugeot">Peugeot </option>
              <option value="Pilgrim">Pilgrim </option>
              <option value="Polestar">Polestar </option>
              <option value="Pontiac">Pontiac </option>
              <option value="Porsche">Porsche </option>
              <option value="Proton">Proton </option>
              <option value="REO">REO </option>
              <option value="Radical">Radical </option>
              <option value="Rage">Rage </option>
              <option value="Raptor">Raptor </option>
              <option value="Reliant">Reliant </option>
              <option value="Renault">Renault </option>
              <option value="Replica">Replica </option>
              <option value="Reva">Reva </option>
              <option value="Riley">Riley </option>
              <option value="Robin">Robin Hood </option>
              <option value="Rolls">Rolls-Royce </option>
              <option value="Rover">Rover </option>
              <option value="SEAT">SEAT </option>
              <option value="SKODA">SKODA </option>
              <option value="Saab">Saab </option>
              <option value="Sebring">Sebring </option>
              <option value="Smart">Smart </option>
              <option value="Spyker">Spyker </option>
              <option value="SsangYong">SsangYong </option>
              <option value="Subaru">Subaru </option>
              <option value="Sunbeam">Sunbeam </option>
              <option value="Suzuki">Suzuki </option>
              <option value="TVR">TVR </option>
              <option value="Talbot">Talbot </option>
              <option value="Tesla">Tesla </option>
              <option value="Tiger">Tiger </option>
              <option value="Toyota">Toyota </option>
              <option value="Triumph">Triumph </option>
              <option value="Ultima">Ultima </option>
              <option value="Vauxhall">Vauxhall </option>
              <option value="Venturi">Venturi </option>
              <option value="Volkswagen">Volkswagen </option>
              <option value="Volvo">Volvo </option>
              <option value="Westfield">Westfield </option>
              <option value="Wolseley">Wolseley </option>
              <option value="Yamaha">Yamaha </option>
              <option value="Zenos">Zenos </option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Car Model:</Form.Label>
            <Form.Control
              name="model"
              value={this.state.model}
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Car Reg:</Form.Label>
            <Form.Control
              name="reg"
              value={this.state.reg}
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group>
          <Form.Label>Time Requested:</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={this.state.time}
            onChange={this.onChange}
          />
          </Form.Group>
          <Form.Group>
          <Form.Label>Job Description:</Form.Label>
          <Form.Control as='textarea'
            name="description"
            value={this.state.description}
            onChange={this.onChange}
          />
          </Form.Group>
          <Form.Control
            style={{ cursor: "pointer" }}
            name="image"
            onChange={(event) => this.onImgChange(event)}
            accept="image/*"
            id="icon-button-file"
            type="file"
            capture="environment"
          />
          {this.state.images.map((image, index) => (
            <div className="addImageList" key={index}>
              <img height="50" width="50" src={image} />
            </div>
          ))}
          <div className='d-flex justify-content-around mt-3' style={{width: '100%'}}>
          <Button style={{minWidth: '85px'}} onClick={this.closeAddJob}>X</Button>
          <Button type='submit' style={{minWidth: '85px'}}>Add Job</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default CreateJob;

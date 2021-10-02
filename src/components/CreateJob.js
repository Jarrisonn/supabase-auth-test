import React, { Component } from 'react';
import '../styles/createjob.css'
import supabase from './supabase';
import {v4 as uuidv4} from 'uuid'
class CreateJob extends Component {
    constructor(props){
        super(props);

        this.state = {
            session: null,
            make: '',
            model: '',
            reg: '',
            time: '',
            description: '',
            images: [],
            jobid: uuidv4(),

        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.insertRow = this.insertRow.bind(this)
        this.closeAddJob = this.closeAddJob.bind(this)
        this.insertImageTable = this.insertImageTable.bind(this)
    }

    componentDidMount(){
        this.setState({
            session: this.props.session,
        })
    }

    onChange(event){

        console.log(event);
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    async onImgChange(event){

        
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
        console.log(publicURL);
        this.insertImageTable(publicURL)

    }

    onSubmit(event){
        event.preventDefault()
        console.log('submitted');
        console.log(this.state.session.user.id);

        console.log(this.state);
        this.insertRow();
        this.props.getJob();
    }

    async insertRow(){
        console.log('row inserted');
        console.log(this.state);

        //insert into jobs table on supabase 
        const { data, error } = await supabase
        .from('job')
        .insert([
        { jobid: this.state.jobid, userid: this.state.session.user.id, car_model: this.state.model, car_make: this.state.make, car_reg: this.state.reg, time_requested: this.state.time, description: this.state.description},
        ])
      
        
        
        

        

    }
    closeAddJob(){
        this.props.getJob();
    }

    async insertImageTable(url){

        console.log(url);
        const { imgdata, imgerror } = await supabase
        .from('images')
        .insert([
        {userid: this.state.session.user.id, imageid: uuidv4(), jobid: this.state.jobid, imageurl: url },
        ])
        if(imgerror) {
            console.log(imgerror.message);
        }

        this.setState({
            images: [...this.state.images, url],
        }, () => {
            console.log(this.state.images);
        })



    }
    

    render() {
        return (
            <div>
                <form className='addform' onSubmit={event => this.onSubmit(event)}>
                    <h2>Add Job Here: </h2>
                    <label>Car Make:</label>
                    <input name='make'value={this.state.make} onChange={this.onChange}/>
                    <label>Car Model:</label>
                    <input name='model'value={this.state.model} onChange={this.onChange}/>
                    <label>Car Reg:</label>
                    <input name='reg'value={this.state.reg} onChange={this.onChange}/>
                    <label>Time Requested:</label>
                    <input type='time' name='time'value={this.state.time} onChange={this.onChange}/>
                    <label>Job Description:</label>
                    <textarea name='description'value={this.state.description} onChange={this.onChange}/>
                    <input
                        style={{ cursor: "pointer", backgroundColor: "red" }}
                        name="image"
                        onChange={(event) => this.onImgChange(event)}
                        accept="image/*"
                        id="icon-button-file"
                        type="file"
                        capture="environment"
                    />
                    {this.state.images.map((image, index) => (
                        <div className='addImageList' key={index}>
                            <img height='50' width='50' src={image}/>
                        </div>
                        
                    ))}
                    <button onClick={this.closeAddJob}>X</button>
                    <button>Add Job</button>
                </form>
            </div>
        );
    }
}

export default CreateJob;

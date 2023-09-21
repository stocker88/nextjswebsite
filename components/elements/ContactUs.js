import React, { Component } from 'react'
import * as emailjs from 'emailjs-com'
import Dialog from 'react'

import { Nav, FormFeedback, Form, FormGroup, Label, Input } from 'reactstrap'
import Button from '../elements/Button'

class ContactForm extends Component {
  state = {
    name: '',
    email: '',
    phoneNumber: '',
    message: 'Please send me the invite link for the beta version of Stocker.',
  }

handleSubmit(e) {
    e.preventDefault()
    const { name, email, phoneNumber, message } = this.state
    let templateParams = {
      from_name: name,
      from_email: email,
      to_name: 'aness.hussein.ali@gmail.com',
      phoneNumber: phoneNumber,
      message_html: message,
     }
     emailjs.send(
      'service_h0q75wd',
      'template_egp9ldh',
       templateParams,
      'user_QuG1TIbvzRN8kheqkRwUr'
     )
     window.alert('Thank you! We will be reaching out to you soon.')
     this.resetForm()
 }
resetForm() {
    this.setState({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }
handleChange = (param, e) => {
    this.setState({ [param]: e.target.value })
  }
render() {
    return (
      <>
          <Form onSubmit={this.handleSubmit.bind(this)} target="my_iframe" style={{alignitems:"right"}}>
          <ul>
              <Label className="text-muted" style={{ color: "white"  }}><b>Email</b></Label>
              <Input
                type="email"
                name="email"
                value={this.state.email}
                className="text-primary"
                onChange={this.handleChange.bind(this, 'email')}
                placeholder="Email"
                style={{ alignItems: "right", flex:1, width: '100%', padding: "8px" }}
              />
            </ul>
          <ul>
              <Label className="text-muted" style={{ textAlign: 'center', color: "white"  }}><b>Name</b></Label>
              <Input
                type="text"
                name="name"
                value={this.state.name}
                className="text-primary"
                onChange={this.handleChange.bind(this, 'name')}
                placeholder="Name"
                style={{ flex:1, width: '100%', padding: "8px" }}
              />
            </ul>
          <ul>
                <Label className="text-muted" style={{ textAlign: 'center', color: "white" }}><b>Phone Number</b></Label>
                <Input
                  type="text"
                  name="phoneNumber"
                  className="text-primary"
                  value={this.state.phoneNumber}
                  onChange={this.handleChange.bind(this, 'phoneNumber')}
                  placeholder='Phone Number'
                  style={{ width: '100%', padding: "8px" }}
                />
            </ul>
          <ul>
              <Label className="text-muted" style={{ textAlign: 'center', color: "white"  }}><b>Message</b></Label>
              <Input
                type="textarea"
                name="message"
                className="text-primary"
                value={this.state.message}
                onChange={this.handleChange.bind(this, 'message')}
                style={{ flex: 11, alignItems: 'center', width: '100%', margin: "8px 0", height: "100px"}}
              />
              </ul>
          <ul>
          <center>
          <Button color="cyan" variant="primary" type="submit">
              Submit
            </Button>
           </center>
           </ul>
          </Form>
      </>
    )
  }
}
export default ContactForm

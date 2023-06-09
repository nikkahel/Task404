import React, {useState} from 'react';
import {Button, Card, Container, Form} from "react-bootstrap";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
const RegistrationForm = () => {
    const [value,setValue]=useState({
        email:'',
        password:'',
        username:''
    })
    const navigate = useNavigate()
    function handleSubmit(e) {
        e.preventDefault()
        axios.post('https://vwervw.herokuapp.com/register',value)
            .then(res=> {
                if(res.data.Status === 'success'){
                    navigate('/')
                } else{
                    alert('This email or username already exists')
                }
            })
            .then(err=>console.log(err))
    }
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">Registration</h2>
                <Form className="d-flex flex-column">
                    <Form.Control value={value.email} onChange={(e)=>setValue({...value, email: e.target.value})} placeholder="Email" className="mt-3" />
                    <Form.Control type="password" value={value.password} onChange={(e)=>setValue({
                        ...value,
                        password: e.target.value
                    })} placeholder="Password" className="mt-3" />
                    <Form.Control type="text" value={value.username} onChange={(e)=>setValue({
                        ...value,
                        username: e.target.value
                    })} placeholder="Username" className="mt-3" />

                    <div className="d-flex justify-content-between no-gutters mt-3">
                        <div>
                            <Link to={'/'} className="link-primary">Have account?</Link>
                        </div>
                        <Button  variant={'outline-success'} onClick={handleSubmit}>
                            Registration
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};
export default observer(RegistrationForm);
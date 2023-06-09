import React, {useContext, useState} from 'react';
import {Button, Card, Container, Form} from "react-bootstrap";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Context} from "../index";
const LoginForm = () => {
    const {store} = useContext(Context)
    const navigate = useNavigate()
    const [value,setValue]=useState({
        email:'',
        password:'',
    })
    function handleSubmit(e) {
        e.preventDefault()
        axios.post('https://vwervw.herokuapp.com/login',value)
            .then(res=> {
                if(res.data.Status === 'success'){
                    navigate('/home')
                    store.setIsAuth(true)
                    store.setUser(value)
                } else{
                    alert(res.data.Error)
                }
            })
            .then(err=>console.log(err))
    }


    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">Login</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        value={value.email}
                        onChange={
                        (e)=>setValue({...value,email:e.target.value})
                    } placeholder="Email" className="mt-3" />
                    <Form.Control
                        type="password"
                        value={value.password} onChange={
                        (e)=>setValue({...value,password:e.target.value})
                    } placeholder="Password" className="mt-3" />
                    <div className="d-flex justify-content-between no-gutters mt-3">
                        <div>
                            <Link to='/register' className="link-primary" >Haven't account?</Link>
                        </div>

                        <Button  variant={'outline-success'} onClick={handleSubmit}>
                            Login
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};
export default LoginForm;
import React, {useContext, useEffect, useState} from 'react';
import {Table, Button, Container, Card} from 'react-bootstrap';
import { Trash, UnlockFill } from 'react-bootstrap-icons';
import {observer} from "mobx-react-lite";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Context} from "../index";
const HomePage = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    useEffect(() =>{
        axios.get('https://vwervw.herokuapp.com/ver')
            .then(res=> {
                if(res.data.Status === 'success'){
                    store.setIsAuth(true)
                } else{
                    store.setIsAuth(false)
                }
            })
    },[])
    useEffect(()=>{
        store.fetchUsers(setUsers)
    },[])
    const handleCheckboxChange = (event, userId) => {
        const { checked } = event.target;
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, selected: checked } : user
            )
        );
    };
    const handleSelectAllChange = (event) => {
        const { checked } = event.target;
        setSelectAll(checked);
        setUsers(prevUsers =>
            prevUsers.map(user => ({ ...user, selected: checked }))
        );
    };
    const handleDeleteUser =  ()=>{
        const deletedUsers = users.filter(user => user.selected);
        console.log(deletedUsers)
        deletedUsers.map((user) => {
            if(store.user.email === user.email)handleLogout();
            store.deleteUser(user.id)
        })
        store.fetchUsers(setUsers)
    }
    const blockUser =  ()=>{
        const filteredUsers = users.filter(user => user.selected)
        filteredUsers.forEach((user)=>{
            if(store.user.email === user.email)handleLogout();
            store.blockUser(user)
        })
        store.fetchUsers(setUsers)
    }
    const unblockUser =  ()=>{
        const filteredUsers = users.filter(user => user.selected)
        filteredUsers.forEach((user)=>{
            store.unblockUser(user)
        })
        store.fetchUsers(setUsers)
    }
    const handleLogout = ()=>{
        store.logout()
        store.setUser({})
    }
    {if(!store.isAuth){
        return (

            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ height: window.innerHeight - 54 }}
            >
                <Card style={{ width: 600 }} className="p-5">
                    <h2 className="m-auto">You are not authorized!</h2>
                        <div className="d-flex justify-content-between no-gutters mt-3">
                            <div>
                                <Link to='/register' className="link-primary" >Haven't account?</Link>
                            </div>

                            <Button  variant={'outline-success'}>
                                <Link to={'/'}/>
                                Login
                            </Button>
                        </div>
                </Card>
            </Container>
        )
    }}
    return (
        <>
            <div className="toolbar d-grid gap-2 d-md-flex justify-content-md-end">
                <Button variant="danger"  onClick={blockUser} >
                    Block
                </Button>
                <Button variant="primary" onClick={unblockUser}  >
                    <UnlockFill className="me-2"  />
                    Unblock
                </Button>
                <Button variant="danger" onClick={handleDeleteUser}  >
                    <Trash className="me-2" />
                    Delete
                </Button>
                <Button variant="danger" onClick={handleLogout} >
                    Logout
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAllChange}
                            aria-label="Select All"
                        />
                    </th>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Last Login Time</th>
                    <th>Registration Time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>
                            <input
                                type="checkbox"
                                checked={user.selected || false}
                                onChange={(event) => handleCheckboxChange(event, user.id)}
                                aria-label="Select User"
                            />
                        </td>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{store.formatDate(user.lastLogin)}</td>
                        <td>{store.formatDate(user.date)}</td>
                        <td>{user.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    );
};
export default observer(HomePage);
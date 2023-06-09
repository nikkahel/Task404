import {makeAutoObservable} from "mobx";
import axios from "axios";
export default class Store{
    user={};
    isAuth=false
    constructor(){
        makeAutoObservable(this)
    }
    setIsAuth (bool){
        this.isAuth=bool
    }
    setUser(user){
        this.user = user;
    }
   fetchUsers(setUsers) {axios.get('https://calm-temple-65876.herokuapp.com/https://vwervw.herokuapp.com/users')
        .then(response => {setUsers(response.data);
            }).catch(error => {
    console.error('Error fetching users:', error);
});}
logout(){
        axios.get('https://vwervw.herokuapp.com/logout')
            .then(response =>{
                window.location.reload()
            }).catch(error =>console.log(error));
    }
    formatDate (dateString){
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    };
    deleteUser (userId) {
        axios
            .delete('https://vwervw.herokuapp.com/user', {data: {userId}})
            .then((res) => {
                if (!res.data.Status === 'success') alert('Error deleting user');
            })
            .catch((err) => {
                console.log(err);
                alert('Error deleting user');
            });
    };
    blockUser(userId) {
        axios
            .put('https://vwervw.herokuapp.com/block', { userId })
            .then((res) => {
                if (!res.data.Status === 'success') alert('Error unblocking user');
            })
            .catch((err) => {
                console.log(err);
                alert('Error unblocking user');
            });
    };
    unblockUser(userId) {
        axios
            .put('https://vwervw.herokuapp.com/unblock', { userId })
            .then((res) => {
                if (!res.data.Status === 'success') alert('Error unblocking user');
            })
            .catch((err) => {
                console.log(err);
                alert('Error unblocking user');
            });
    };
}
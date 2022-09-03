<template>
    <div class="container mt-5">
        <div class="d-flex justify-content-center">
            <h1>Online Banking Application</h1>    
        </div>
        
        <form @submit.prevent="submitForm">
            
            <div class="form-group">
                <label for="InputEmail">Email address</label>
                <input type="email" class="form-control" id="InputEmail" placeholder="Enter email" v-model="userlogin.email">
            </div>
            <div class="form-group mt-3">
                <label for="InputPassword1">Password</label>
                <input type="password" class="form-control" id="InputPassword1" placeholder="Password" v-model="userlogin.password">
            </div>
            <div class="text-danger">{{ errorstatus }}</div>
            <div class="d-grid gap-2 mt-3">
                <button  type="submit" class="btn btn-success btn-block mt-3">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { ApiUrl } from "../../ApiUrl";
export default {
    data(){
        return{
            userlogin:{
                email:'',
                password:'',
            },
            errorstatus:'',
        }
    },
    methods:{
        submitForm(){
            let apiUrl = `${ApiUrl}/login`
            axios.post(apiUrl,this.userlogin).then((res) => {
                if(res.data.token){
                    localStorage.setItem("token", res.data.token);
                    //this.$router.push('/account');
                    window.location.href = 'account';
                }
            }).catch(err =>{
                this.errorstatus = err.response.data
            })
        }
    },
    created() {
    let token = localStorage.getItem("token");
    if (token) {
      //alert('don\'t have token')
      this.$router.push("/account");
      //window.location.href = 'account';
    }
  },
}
</script>
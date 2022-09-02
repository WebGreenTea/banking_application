<template>
    <div class="container mt-5">
        <div class="d-flex justify-content-center">
            <h1>Open new bank accounts</h1>    
        </div>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="InputEmail">Email address</label>
                <input @click="clearErr" type="email" class="form-control" id="InputEmail" placeholder="Enter email" v-model="user.email">
                <div class="text-danger"><p>{{ errorstatus }}</p></div>
            </div>
            <div class="form-group mt-3">
                <label for="InputFname">Your first name</label>
                <input type="text" class="form-control" id="InputFname" placeholder="First Name" v-model="user.fname">
            </div>
            <div class="form-group mt-3">
                <label for="InputFname">Your last name</label>
                <input type="text" class="form-control" id="InputLname" placeholder="Last Name" v-model="user.lname">
            </div>
            <div class="form-group mt-3">
                <label for="InputPassword1">Password</label>
                <input type="password" class="form-control" id="InputPassword1" placeholder="Password" v-model="user.password">
            </div>
            <div class="d-grid gap-2 mt-3">
                <button  type="submit" class="btn btn-primary btn-block">Open bank accounts</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { ApiUrl } from "../../ApiUrl";
export default {
    data() {
        return{
            user:{
                fname: '',
                lname:'',
                email:'',
                password:'',
            },
            errorstatus: "",
        }
    },
    methods:{
        submitForm(){
            let apiUrl = `${ApiUrl}/register`;

            axios.post(apiUrl,this.user).then((res) => {
                if(res.data.token){
                    localStorage.setItem("token", res.data.token);
                    this.$router.push('/account');
                    this.user = {
                        fname: '',
                        lname:'',
                        email:'',
                        password:'',
                    }
                }
            }).catch(err =>{
                console.log(err)
                this.errorstatus = err.response.data
            })
        },
        clearErr(){
            this.errorstatus = ''
        }
        
    },
    created() {
    let token = localStorage.getItem("token");
    if (token) {
      //alert('don\'t have token')
      this.$router.push("/account");
    }
  },
}
</script>
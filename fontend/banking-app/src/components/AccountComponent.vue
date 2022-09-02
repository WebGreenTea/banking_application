<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between flex-nowrap flex-row">
    <div class="container">
       <a class="navbar-brand float-left" href="/account" >{{userData.first_name}} {{userData.last_name}}</a>
      <div class="collapse navbar-collapse topnav-right" >
        
        <ul class="nav navbar-nav ms-auto">
          <li class="nav-item">
            <a href="#"  class="nav-link pr-3" @click="Logout">Log out</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    <div class="container mt-5">
        <div class="row">
            <div class="col-sm d-flex">
                <div>
                    <div>
                        <h5>Account Number</h5>
                        <h2>{{userData.account_number}}</h2>
                    </div>
                    <div class="mt-3">
                        <h5>Your Balance</h5>
                        <h1>{{ formatToCurrency(userData.balance) }}</h1>
                    </div>
                    <div class="mt-2" v-if="haveInterestData()">
                        <p>interest they will be earned at the end of the year {{this.interestPercent}}% ({{ this.interest }} ฿)</p> 
                    </div>
                    
                </div>
                
            </div>
            <div class="col-sm ">
                <div class="d-grid gap-2">
                    <button class="text-white btn btn-dark-moon" type="button" @click="showDeposit">Deposit</button>
                    <button class="text-white btn btn-dark-moon" type="button" @click="showWithdraw">Withdraw</button>
                    <button class="text-white btn btn-dark-moon" type="button" @click="showTransfer">Transfer</button>
                    <button class="text-white btn btn-purple-moon" type="button" @click="showHistory">Transaction history</button>
                </div>
            </div>
        </div>
        <hr class="mt-5 mb-5">    
    </div>
    
    <div v-if="deposit">
        <deposit-template :userID="userData.user_id"  @update-amount="updateAmount"/>
    </div>
    <div v-if="withdraw">
        <withdraw-template :userID="userData.user_id"  @update-amount="updateAmount"/>
    </div>
    <div v-if="transfer">
        <transfer-template :userID="userData.user_id"  @update-amount="updateAmount"/>
    </div>
    <div v-if="history">
        <history-template :userID="userData.user_id"/>
    </div>

    
</template>

<script>
import axios from 'axios';
import { checklogin } from "./js/verify.js";
import { ApiUrl } from "../../ApiUrl";
import depositTem from './depositTem.vue'
import withdrawTem from './withdrawTem.vue'
import transferTem from './transferTem.vue'
import historyTem from './historyTem.vue'


export default {
    data(){
        return {
            userData:{
                user_id:null,
                first_name:null,
                last_name:null,
                email:null,
                balance:null,
                account_number:null
            },
            deposit:false,
            withdraw:false,
            transfer:false,
            history:false,
            interestPercent:null,
            interest:null,
        }
    },
    components:{
        'deposit-template':depositTem,
        'withdraw-template':withdrawTem,
        'transfer-template':transferTem,
        'history-template':historyTem,
    },
    methods:{
        Logout() {
            localStorage.removeItem("token");
            this.$router.push("/");
        },
        formatToCurrency(amount){
            return ((amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))+" ฿"; 
        },
        showDeposit(){
            this.deposit = true
            this.withdraw = false
            this.transfer = false
            this.history = false
        },
        showWithdraw(){
            this.deposit = false
            this.withdraw = true
            this.transfer = false
            this.history = false
        },
        showTransfer(){
            this.deposit = false
            this.withdraw = false
            this.transfer = true
            this.history = false
        },
        showHistory(){
            this.deposit = false
            this.withdraw = false
            this.transfer = false
            this.history = true
        },
        updateAmount(newData){
            this.userData.balance = newData
            let apiUrl = `${ApiUrl}/get-interest/${this.userData.user_id}`;
            axios.get(apiUrl).then((res) =>{
                this.interestPercent = res.data.interestPercent
                this.interest = res.data.interest
            }).catch(err =>{
                console.log(err)
            })

        },
        haveInterestData(){
            if(this.interestPercent && this.interest){
                return true
            }
            return false
        }
    },
    async created() {
        //login check
        const logindata = await checklogin();

        if (!logindata.login) {
            window.location.href = 'login';
            
        }else{
            let userid = logindata.id
            let apiUrl = `${ApiUrl}/getuserdata/${userid}`;
            axios.get(apiUrl).then((res) =>{
                this.userData = res.data 
            }).catch(err =>{
                console.log(err)
            })
            apiUrl = `${ApiUrl}/get-interest/${userid}`;
            axios.get(apiUrl).then((res) =>{
                this.interestPercent = res.data.interestPercent
                this.interest = res.data.interest
            }).catch(err =>{
                console.log(err)
            })
        }



    
  },
}
</script>
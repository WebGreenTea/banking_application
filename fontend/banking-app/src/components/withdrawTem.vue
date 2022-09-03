<template>
    <div class="container mt-5">
        <div class="container me-5">
            <form @submit.prevent="onWithdraw">
                <div class="mb-3">
                    <div class="d-flex justify-content-center">
                        <h1>Withdraw</h1>
                    </div>
                    
                    <input type="number" class="form-control"  placeholder="amount to withdraw" required min="0"  step=".01" v-model="amount">
                </div>
                <div class="d-grid gap-2 mt-3">
                    <button class="text-white btn btn-orange-moon fw-bold" type="submit">Withdraw</button>
                </div>
            </form>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios';
import { ApiUrl } from "../../ApiUrl";
export default {
    emits:['update-amount'],
    props:['userID'],
    data(){
        return{
            amount:null
        }
    },
    methods:{
        onWithdraw(){
            let apiurl = `${ApiUrl}/withdraw`
            axios.post(apiurl,{userID:this.userID,amount:this.amount}).then((res)=>{
                this.$emit('update-amount',res.data.balance)
                //console.log(res.data.message)
                alert(res.data.message)
                this.amount=''
            }).catch(err =>{
                alert(err.response.data)
            })
        }
    }
}
</script>
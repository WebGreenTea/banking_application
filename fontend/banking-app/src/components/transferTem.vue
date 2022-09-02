<template>
    <div class="container mt-5">
        <div class="container me-5">
            <form @submit.prevent="onTransfer">
                <div class="d-flex justify-content-center">
                        <h1>Transfer</h1>
                    </div>
                <div class="mb-3">
                    <label for="amountinput" class="form-label">Amount</label>
                    <input type="number" class="form-control" id="amountinput"  placeholder="amount to transfer" required min="0"  step=".01" v-model="amount">
                </div>
                <div class="mb-3">
                    <label for="inputRecipient" class="form-label">Recipient</label>
                    <input type="text" class="form-control" id="inputRecipient" placeholder="Account number Recipient" required v-model="recipientNumber">
                </div>

                <div class="d-grid gap-2 mt-3">
                    <button class="text-white fw-bold btn btn-ultra-voilet" type="submit">Transfer</button>
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
            amount:null,
            recipientNumber:'',
        }
    },
    methods:{
        onTransfer(){
            let apiurl = `${ApiUrl}/transfer`
            axios.post(apiurl,{userID:this.userID,amount:this.amount,recipient:this.recipientNumber}).then((res)=>{
                this.$emit('update-amount',res.data.balance)
                console.log(res.data.message)
                alert(res.data.message)
                this.amount=''
            }).catch(err =>{
                alert(err.response.data)
            })
        }
    }
}
</script>
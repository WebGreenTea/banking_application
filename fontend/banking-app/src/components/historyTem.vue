<template>
    <div class="container">
        <h1 class="mb-3">Transaction history</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">date and time</th>
                    <th scope="col">action</th>
                    <th scope="col" class="text-end">amount (฿)</th>
                    <th scope="col" class="text-center">recipient</th>
                    <th scope="col" class="text-center">sender</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(history, index) in allHistory" :key="index">
                    <td>{{ history.date_time }}</td>

                    <td>{{history.action}}</td>

                    <td v-if="isreceive(history.action)" class="text-success text-end">+{{formatToCurrency(history.transaction_amount)}}</td>
                    <td v-else class="text-danger text-end">-{{formatToCurrency(history.transaction_amount)}}</td>

                    <td class="text-center">
                        <div v-if="history.recipient">
                                {{history.recipient}}
                        </div>
                    </td>
                    <td class="text-center">
                        <div v-if="history.sender">
                            {{history.sender}}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import { ApiUrl } from "../../ApiUrl";
export default {
    props:['userID'],
    data(){
        return{
            allHistory:[]
        }
    },
    methods:{
        formatToCurrency(amount){
            return ((amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')); 
        },
        isreceive(action){
            if(action == 'deposit' || action == 'receive'){
                return true
            }
            return false
        }
    },
    async created() {
        let apiUrl = `${ApiUrl}/history/${this.userID}`
        axios.get(apiUrl).then((res)=>{
            this.allHistory = res.data
            //console.log(this.allHistory)
        }).catch(err =>{
            console.log(err.response.data)
        })
    }
}
</script>
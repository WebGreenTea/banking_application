<template>
    <div class="container">
        <h1 class="mb-3">Transaction history</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">date and time</th>
                    <th scope="col">amount (฿)</th>
                    <th scope="col">action</th>
                    <th scope="col">recipient</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(history, index) in allHistory" :key="index">
                    <td>{{ history.date_time }}</td>
                    <td>{{formatToCurrency(history.transaction_amount)}}</td>
                    <td>{{history.action}}</td>
                    <td>
                        <div v-if="history.first_name">
                            <div>
                                {{history.first_name}} {{history.last_name}} ({{history.account_number}})
                            </div>
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
    },
    async created() {
        let apiUrl = `${ApiUrl}/history/${this.userID}`
        axios.get(apiUrl).then((res)=>{
            this.allHistory = res.data
            console.log(this.allHistory)
        }).catch(err =>{
            console.log(err.response.data)
        })
    }
}
</script>
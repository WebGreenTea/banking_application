<template>
    <div class="container mt-5 ">
        <div class="d-flex justify-content-center">
            <h2>Welcome to online banking website</h2>
        </div>
        <div class="d-flex justify-content-center">
            <div>
                <router-link to="/login" class="btn btn-success btn-lg me-2">Login</router-link>
                <router-link to="/register" class="btn btn-primary btn-lg ms-2">Open new bank accounts</router-link>
            </div>
        </div>

         
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    }
}
</script>
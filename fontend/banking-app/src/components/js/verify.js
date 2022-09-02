import axios from "axios"

async function checklogin() {
  let apiURL = "http://localhost:3000/verify-token";
  let token = localStorage.getItem("token");
  
  if (token) {
    
    let data = { token: token };
    
    const res = await axios.post(apiURL, data).then((res) => res.data )

    return res

  }
  
  return { id:null,email: "", login: false }
}

export { checklogin }
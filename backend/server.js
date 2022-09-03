const express =  require('express')
const mysql = require('mysql')
const bp = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express();
require('dotenv').config()

const pool = require('./database')
const JWT_KEY = process.env.JWT_KEY
const INTEREST = parseFloat(process.env.INTEREST)

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors());


function genAccountNumber(){
    let result = '';
    for ( var i = 0; i < 10; i++ ) {
        result += ((Math.floor(Math.random() * 10)));
    }
    return result
}

app.post('/register',async (req,res) =>  {
    
    try{
        const {fname,lname,email,password} = req.body;
        if(!(fname && lname && password && email)){
            return res.status(400).send("All input is required")
        }

        
        //check email
        const olduser = await pool.query("SELECT * FROM users WHERE email = ? ",[email])
        if(olduser.length == 0){
            //encrypt password
            const salt = await bcrypt.genSalt(10);
            encryptedPass = await bcrypt.hash(password,salt);

            //create user
            //create account number
            accountNum = genAccountNumber();
            haveAccNum = await pool.query("SELECT * FROM users WHERE account_number = ? ",[accountNum])
            while(haveAccNum.length != 0){
                accountNum = genAccountNumber();
                haveAccNum = await pool.query("SELECT * FROM users WHERE account_number = ? ",[accountNum]);
            }
            //add new user
            
            pool.query("INSERT INTO users(first_name,last_name,password,email,account_number) VALUES(?,?,?,?,?)",[fname,lname,encryptedPass,email,accountNum],(err,result,fields) =>{
                if(err){
                    console.log(err)
                    return res.status(400).send();
                }else{
                    user_id = result.insertId;
                    //create token
                    const token = jwt.sign(
                        {user_id:user_id,email:email},
                        JWT_KEY
                    )
                    return res.status(201).json({token:token})
                }  
            })
        }else{
            return res.status(400).send("Already have this email")
        }

    }catch(err){
        console.log(err)
    }
})

app.post('/login',async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(!(email && password)){
            return res.status(400).send("All input is required")
        }
        
        const user = (await pool.query("SELECT * FROM users WHERE email = ? ",[email]))[0];
        
        if(user && (await bcrypt.compare(password,user.password))){
            //create token
            const token = jwt.sign(
                {user_id:user.users_id,email:email},
                JWT_KEY
            );
            return res.status(200).json({token:token})
        }else{
            
            return res.status(400).send("Wrong email or password")
        }

    }catch(err){
        console.log(err)
    }
})

app.post('/verify-token', async (req,res) =>{
    
    const token = req.body.token
    
    try {
        const user = jwt.verify(token, JWT_KEY)
        return res.json({ id: (user.user_id), email: (user.email), login: true })
    } catch (e) {
        return res.json({ id: null,email:"", login: false })
    }
})

app.get('/getuserdata/:id', async (req,res) =>{
    
    try{
        const userID = req.params.id;    
        
        pool.query("SELECT * FROM users WHERE users_id = ?",[userID],(err,result,fields)=>{
            if(err){
                console.log(err)
                return res.status(400).send();
            }else{
                result = result[0]
                return res.status(200).json({
                    user_id:result.users_id,
                    first_name:result.first_name,
                    last_name:result.last_name,
                    email:result.email,
                    balance:result.balance,
                    account_number:result.account_number
                })
            }
        })



    }catch(err){
        console.log(err)
    }
})


app.post('/deposit', async (req,res)=>{
    try{
        const userID = req.body.userID
        const amount = req.body.amount

        //check amount
        if((!amount)||amount <= 0 ){
            console.log(amount)
            return res.status(400).send("wrong amount")
        }

        //check userid
        if(!userID){
            return res.status(400).send("User ID is invalid")
        }

        pool.query("UPDATE users SET balance = balance + ? WHERE users_id = ?",[amount,userID],async (err,result,fields)=>{
            if(err){
                console.log(err)
                return res.status(400).send();
            }

            let newBalance = (await pool.query("SELECT balance FROM users WHERE users_id = ?",[userID]))[0].balance
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await pool.query("INSERT INTO transaction(users_id,date_time,transaction_amount,action) VALUE(?,?,?,?)",[userID,date,amount,'deposit'])
            return res.status(200).json({message:"deposit successfully",balance:newBalance})

        })

    }catch(err){
        console.log(err)
    }
})


app.post('/withdraw', async (req,res)=>{
    try{
        const userID = req.body.userID
        const amount = req.body.amount

        //check amount
        if((!amount)||amount <= 0 ){
            console.log(amount)
            return res.status(400).send("wrong amount")
        }

        //check userid
        if(!userID){
            return res.status(400).send("User ID is invalid")
        }

        //check current balance
        let currentBalance = (await pool.query("SELECT balance FROM users WHERE users_id = ?",[userID]))[0].balance
        if(currentBalance < amount){
            return res.status(400).send("Insufficient funds in your account")
        }

        pool.query("UPDATE users SET balance = balance - ? WHERE users_id = ?",[amount,userID],async (err,result,fields)=>{
            if(err){
                console.log(err)
                return res.status(400).send();
            }

            let newBalance = (await pool.query("SELECT balance FROM users WHERE users_id = ?",[userID]))[0].balance
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await pool.query("INSERT INTO transaction(users_id,date_time,transaction_amount,action) VALUE(?,?,?,?)",[userID,date,amount,'withdraw'])
            return res.status(200).json({message:"withdraw successfully",balance:newBalance})

        })

    }catch(err){
        console.log(err)
    }
})


app.post('/transfer', async (req,res)=>{
    try{
        const userID = req.body.userID
        const amount = req.body.amount
        const recipientNumber = req.body.recipient

        //check amount
        if((!amount)||amount <= 0 ){
            console.log(amount)
            return res.status(400).send("wrong amount")
        }

        //check userid
        if(!userID){
            return res.status(400).send("User ID is invalid")
        }

        //check current balance
        let currentBalance = (await pool.query("SELECT balance FROM users WHERE users_id = ?",[userID]))[0].balance
        if(currentBalance < amount){
            return res.status(400).send("Insufficient funds in your account")
        }
        
        //check Recipient
        let Recipient = (await pool.query("SELECT * FROM users WHERE account_number = ?",[recipientNumber]))[0]
        let recipientID = Recipient.users_id
        let haveRecipient = Recipient.account_number
        if(!haveRecipient){
            return res.status(400).send("Invalid recipient account number")
        }
        //get account number of owner
        const accountNumber = (await pool.query("SELECT account_number FROM users WHERE users_id = ?",[userID]))[0].account_number

        //check that same account number?
        if(accountNumber == recipientNumber){
            return res.status(400).send("Invalid recipient account number")
        }

        //tranfer
        pool.query(`UPDATE users SET balance = CASE account_number WHEN '${accountNumber}' THEN balance - ${amount} WHEN '${recipientNumber}' THEN balance + ${amount} ELSE balance END WHERE account_number IN('${accountNumber}', '${haveRecipient}')`,async (err,result,fields)=>{
            if(err){
                console.log(err)
                return res.status(400).send();
            }

            //get new balance of sender
            let newBalance = (await pool.query("SELECT balance FROM users WHERE users_id = ?",[userID]))[0].balance
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            //update history of sender
            await pool.query("INSERT INTO transaction(users_id,date_time,transaction_amount,action,recipient) VALUE(?,?,?,?,?)",[userID,date,amount,'transfer',recipientID])
            //update history of receive
            await pool.query("INSERT INTO transaction(users_id,date_time,transaction_amount,action,sender) VALUE(?,?,?,?,?)",[recipientID,date,amount,'receive',userID])
            return res.status(200).json({message:"transfer successfully",balance:newBalance})

        })

    }catch(err){
        console.log(err)
    }
})


app.get('/get-interest/:id', async (req,res)=>{
    try{
        const userID = req.params.id;
        let currentBalance = (await pool.query("SELECT balance FROM users WHERE users_id = ?",[userID]))[0].balance
        let moneyinterest = (INTEREST*currentBalance).toFixed(2)
        return res.status(200).json({interestPercent:INTEREST,interest:moneyinterest})
    }catch(err){
        console.log(err)
    }
})

app.get('/history/:id', async (req,res)=>{
    try{
        const userID = req.params.id;
        pool.query("SELECT (transaction.date_time),(transaction.transaction_amount),(transaction.action),(users.first_name),(users.last_name),(users.account_number) FROM transaction  LEFT JOIN users ON transaction.recipient=users.users_id OR transaction.sender=users.users_id WHERE transaction.users_id = ?",[userID],(err,result,fields) =>{
            if(err){
                console.log(err)
                return res.status(400).send();
            }

            finalResult = []
            for(let i =0;i<result.length;i++){
                //result[i].date_time = result[i].date_time.toUTCString()
                let recipient = null
                let sender = null
                if(result[i].action == 'transfer'){
                    recipient = `${result[i].first_name} ${result[i].last_name} (${result[i].account_number})`
                }
                if(result[i].action == 'receive'){
                    sender = `${result[i].first_name} ${result[i].last_name} (${result[i].account_number})`
                }
                finalResult.push({
                    date_time:result[i].date_time.toUTCString(),
                    transaction_amount:result[i].transaction_amount,
                    action:result[i].action,
                    recipient:recipient,
                    sender:sender
                })

            }
            //console.log(finalResult)
            return res.status(200).json(finalResult)
        })
    }catch(err){

    }
})

app.listen(3000,() => console.log('server is running on port 3000'))
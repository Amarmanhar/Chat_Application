const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const usersRouter = require('./routes/users');

app.use(cors());
app.use(bodyParser.urlencoded({entended:false}));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('hello from server');
})

app.use('/add', usersRouter);


sequelize.sync()
.then(()=>{
    app.listen( process.env. PORT ||5000, ()=>{
        console.log('server is running');
    })
})
.catch((err)=>{
    console.log(err);
})

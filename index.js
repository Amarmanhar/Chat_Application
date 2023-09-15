const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


const { Server } = require('socket.io');
const socketioFile = require('socket.io-file');
const httpServer = require('http').createServer(app); 
const io = new Server(httpServer,{
    cors: {
        origin: "*",
      },
});

io.on("connection", (socket) => {
    console.log(socket.id); 

    socket.on('joinGroup', (groupName) => {
        socket.join(groupName);
    });

     socket.on('chatMessage', (data) => {
        io.to(data.groupName).emit('message', data);
    });

    socket.on('sendFile', (data)=>{
        const { fileUrl, selectedGroupNames, username } = data;
        io.to(selectedGroupNames).emit('fileReceived', {
            username,
            fileUrl,
        });
    })

  });

const sequelize = require('./utils/database');

const Users = require('./models/users');
const chatMessage = require('./models/chatMessage');
const Groups = require('./models/groups');
const groupMembers = require('./models/groupMembers');

const usersRouter = require('./routes/users');
const chatMessageRouter = require('./routes/chatMessage');
const groupRouter = require('./routes/group');

app.use(cors());
app.use(bodyParser.urlencoded({entended:false}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('hello from server');
})


app.use('/add', usersRouter);
app.use('/post-chat', chatMessageRouter);
app.use('/group', groupRouter);


Users.belongsToMany(Groups, { through: groupMembers, foreignKey: 'userId' });
Groups.belongsToMany(Users, { through: groupMembers, foreignKey: 'groupId' });

// Define the relationship between Users and GroupMembers for admin users
Users.hasMany(groupMembers, { foreignKey: 'userId' });
groupMembers.belongsTo(Users, { foreignKey: 'userId' });

chatMessage.belongsTo(Users, { foreignKey: 'userId' });
chatMessage.belongsTo(Groups, { foreignKey: 'groupId' });

// Define the inverse relationships
Users.hasMany(chatMessage, { foreignKey: 'userId' });
Groups.hasMany(chatMessage, { foreignKey: 'groupId' });

// Define the relationship between Groups and GroupMembers
Groups.hasMany(groupMembers, { foreignKey: 'groupId' });
groupMembers.belongsTo(Groups, { foreignKey: 'groupId' });

sequelize.sync()
.then(()=>{
    httpServer.listen( 5000, ()=>{
        console.log('server is running');
    })
})
.catch((err)=>{
    console.log(err);
})

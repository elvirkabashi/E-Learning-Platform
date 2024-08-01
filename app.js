const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const sequelize = require('./config/database');
const userRoutes = require('./routes/user')
const threadRoutes = require('./routes/thread')
const courseRoutes = require('./routes/course')
const replyRoutes = require('./routes/reply')

const adminRoutes = require('./routes/admin')


const User = require('./models/user');
const UserDetails = require('./models/userDetails');
const Course = require('./models/course');
const Enrollment = require('./models/enrollment');
const Thread = require('./models/thread');
const Reply = require('./models/reply');


dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(userRoutes);
app.use(courseRoutes);
app.use(threadRoutes);
app.use(replyRoutes);

app.use('/admin',adminRoutes);


User.hasOne(UserDetails, { foreignKey: 'userId' , as:'details'});
UserDetails.belongsTo(User, { foreignKey: 'userId', as:'details' });

User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { foreignKey: 'instructorId' });

User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });

Course.hasMany(Thread, { foreignKey: 'courseId', });
Thread.belongsTo(Course, { foreignKey: 'courseId',});

User.hasMany(Thread, { foreignKey: 'instructorId' });
Thread.belongsTo(User, { foreignKey: 'instructorId' });

Thread.hasMany(Reply, { foreignKey: 'threadId', as: 'replies' });
Reply.belongsTo(Thread, { foreignKey: 'threadId',as: 'thread' });

User.hasMany(Reply, { foreignKey: 'userId' });
Reply.belongsTo(User, { foreignKey: 'userId',as: 'user', });



app.get('/', (req, res) => {
  res.send('Welcome to the E-Learning Platform API');
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));



sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

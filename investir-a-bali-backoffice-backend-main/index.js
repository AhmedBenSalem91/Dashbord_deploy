const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const villasRoute = require('./routes/villas');
const homesRoute = require('./routes/home');
const teamMemberRoute = require('./routes/teamMembers');
const blogRoute = require('./routes/blog');
const linkRoute = require('./routes/link');
const messageRoute = require('./routes/message');
const analytics = require('./routes/analytics')

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoute); 
app.use('/users', usersRoute);
app.use('/villas', villasRoute);
app.use('/homes', homesRoute);
app.use('/team-members', teamMemberRoute);
app.use('/blogs', blogRoute);
app.use('/links', linkRoute);
app.use('/messages', messageRoute);
app.use('/uploads', express.static('uploads'));
app.use("/",analytics)


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,  // Options recommandées pour éviter les avertissements
    useUnifiedTopology: true, // Pour une gestion de la connexion optimisée
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

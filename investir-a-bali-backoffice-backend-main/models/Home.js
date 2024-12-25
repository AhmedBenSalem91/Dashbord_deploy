const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    title: { type: String },
    hero: { type: String },
    services: { type: String },
    expertises: [{
        name: { type: String },
        description: { type: String } 
    }],
    about_img: { type: String },
    about_desc: { type: String }
});

const Home = mongoose.model('Home', homeSchema);
module.exports = Home;

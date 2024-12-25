const mongoose = require('mongoose');

const villaSchema = new mongoose.Schema({
    villaname: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    state : { type: String },
    nb_bedroom: { type: Number },
    nb_livingroom: { type: Number },
    nb_bathroom: { type: Number },
    nb_pool: { type: Number },
    parking_capacity: { type: Number },
    area: { type: Number },
    img_album: { type: [String] }
});

const Villa = mongoose.model('Villa', villaSchema);
module.exports = Villa;

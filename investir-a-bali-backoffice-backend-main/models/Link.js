const mongoose = require('mongoose');

// Define the schema for a link
const linkSchema = new mongoose.Schema({
    label: { type: String }, // Name or label for the link that is displayed in the website
    url: { type: String, default: '#'},   // where to?
    type: { type: String },  // Type of the link can be phone, email, nav, whatsapp, adresse
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;

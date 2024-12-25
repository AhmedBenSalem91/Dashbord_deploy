const mongoose = require('mongoose');
const Link = require('../models/Link');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

async function createLinks() {
    try {
        const linksData = [
            { label: "+6267574638493", url: "+6267574638493", type: "phone" },
            { label: "whatsapp", url: "6267574638493", type: "whatsapp" },
            { label: "BOOK A MEETING", url: "/contact", type: "contactLink" },
            { label: "STATUT DES TERRAINS", url: "/nosrealisations", type: "nav" },
            { label: "CONTACTEZ NOU", url: "/contact", type: "nav" },
            { label: "VILLAS CATALOGUE", url: "/nosrealisations", type: "nav" },
            { label: "BALI ENTRE AMIS", url: "/blog", type: "nav" },
            { label: "GESTION LOCATION", url: "/nosrealisations", type: "nav" },
            { label: "FAQ", url: "/FAQ", type: "nav" },
            { label: "INFORMATIONS", url: "/a_propos_de_nous", type: "nav" },
            { label: "sales@investireabali.com", url: "sales@investireabali.com", type: "email" },
            { label: "Kerobokan, Bali Indonesia", url: "", type: "adresse" }
        ];

        await Link.insertMany(linksData);
        console.log(`12 Links created successfully`);

        mongoose.disconnect(); // Disconnect from the database once the operation is done
    } catch (err) {
        console.error('Error creating links:', err);
    }
}

createLinks();

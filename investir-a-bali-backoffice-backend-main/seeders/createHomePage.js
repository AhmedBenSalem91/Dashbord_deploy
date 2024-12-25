const mongoose = require('mongoose');
const Home = require('../models/Home');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

async function createHomePage() {
    try {
        const homeData = {
            title: "EXPERT EN CONSTRUCTION A BALI DEPUIS 2006",
            hero: "",
            services: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            expertises: [
                {
                    name: "suivi des chantiers",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac."
                },
                {
                    name: "realisation de vos plans",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac."
                },
                {
                    name: "mise en place de strategies",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac."
                }
            ],
            about_img: "",
            about_desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac."
        };

        const home = new Home(homeData);
        await home.save();
        console.log(`Home page data created successfully`);

        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating home page data:', err);
    }
}

createHomePage();

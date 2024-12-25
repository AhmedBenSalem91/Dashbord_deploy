const mongoose = require('mongoose');
const Villa = require('../models/Villa'); // Adjust the path if necessary
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

async function createVillas() {
    try {
        const villas = [
            {
                villaname: 'Villa Sunrise',
                location: 'Bali',
                description: 'A beautiful villa with ocean view.',
                price: 500.000,
                state: "done",
                nb_bedroom: 3,
                nb_livingroom: 2,
                nb_bathroom: 2,
                nb_pool: 1,
                parking_capacity: 2,
                area: 200,
                img_album: ['sunrise1.jpg', 'sunrise2.jpg']
            },
            {
                villaname: 'Villa Sunset',
                location: 'Hawaii',
                description: 'Luxury villa with sunset view.',
                price: 600.000,
                state: "in progress",
                nb_bedroom: 4,
                nb_livingroom: 3,
                nb_bathroom: 3,
                nb_pool: 2,
                parking_capacity: 3,
                area: 250,
                img_album: ['sunset1.jpg', 'sunset2.jpg']
            },
            {
                villaname: 'Villa Serenity',
                location: 'Maldives',
                description: 'A peaceful villa with private beach access.',
                price: 700.000,
                state: "done",
                nb_bedroom: 5,
                nb_livingroom: 4,
                nb_bathroom: 4,
                nb_pool: 2,
                parking_capacity: 4,
                area: 300,
                img_album: ['serenity1.jpg', 'serenity2.jpg']
            },
            {
                villaname: 'Villa Dream',
                location: 'Santorini',
                description: 'Charming villa with panoramic views.',
                price: 650.000,
                state: "done",
                nb_bedroom: 3,
                nb_livingroom: 2,
                nb_bathroom: 2,
                nb_pool: 1,
                parking_capacity: 2,
                area: 220,
                img_album: ['dream1.jpg', 'dream2.jpg']
            },
            {
                villaname: 'Villa Oasis',
                location: 'Dubai',
                description: 'Modern villa with luxurious amenities.',
                price: 800.000,
                state: "in progress",
                nb_bedroom: 6,
                nb_livingroom: 3,
                nb_bathroom: 5,
                nb_pool: 3,
                parking_capacity: 5,
                area: 350,
                img_album: ['oasis1.jpg', 'oasis2.jpg']
            }
        ];

        for (let villaData of villas) {
            const villa = new Villa(villaData);
            await villa.save();
            console.log(`Villa ${villa.villaname} created successfully`);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating villas:', err);
    }
}

createVillas();

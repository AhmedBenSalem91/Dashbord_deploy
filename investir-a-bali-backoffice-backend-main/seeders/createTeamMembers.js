const mongoose = require('mongoose');
const TeamMember = require('../models/TeamMember'); // Assuming TeamMember.js is in the models folder
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

async function createTeamMembers() {
    try {
        const teamMembersData = [
            {
                name: "Nicolas",
                email: "nicolas@example.com",
                memberRole: "HEAD OF CONSTRUCTION",
                avatar: "avatar1.jpg" // Example file path or URL for the avatar
            },
            {
                name: "Veronique",
                email: "veronique@example.com",
                memberRole: "HEAD OF DESIGN",
                avatar: "avatar2.jpg"
            },
            {
                name: "Clement",
                email: "clement@example.com",
                memberRole: "SALES MANAGER",
                avatar: "avatar3.jpg"
            }
        ];

        await TeamMember.insertMany(teamMembersData);
        console.log(`3 Team members created successfully`);

        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating team members:', err);
    }
}

// Run the function to create team members
createTeamMembers();

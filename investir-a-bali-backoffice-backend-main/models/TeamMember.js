const mongoose = require('mongoose');

// Define the schema for a team member
const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    memberRole: { type: String },
    avatar: { type: String },
}, {
    timestamps: true,
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;

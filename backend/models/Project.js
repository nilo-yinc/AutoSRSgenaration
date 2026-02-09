const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    domain: {
        type: String, // web, app, ai
        required: true
    },
    teamMembers: [{
        name: String,
        rollNo: String,
        univRollNo: String
    }],
    techStack: {
        frontend: String,
        backend: String,
        database: String
    },
    cocomo: {
        kloc: Number,
        effort: Number,
        cost: Number,
        time: Number
    },
    diagrams: {
        useCase: String,
        dfd0: String,
        dfd1: String,
        classDiagram: String
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    shareId: {
        type: String,
        unique: true,
        sparse: true
    },
    prototypeHtml: {
        type: String
    },
    hasPrototype: {
        type: Boolean,
        default: false
    },
    enterpriseData: {
        type: Object, // Stores the full SRSRequest JSON
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

const mongoose = require('mongoose');
const { IssueSchema } = require('./Issue')

// console.log(IssueSchema)

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issues: { type: [ IssueSchema ], unique: true }
})

const newProject = new mongoose.model('Project', ProjectSchema);


const findProject = async (name) => {
    const myProject = await newProject.find({ name: name }).catch((e) => { throw new Error(e) });
    console.log(myProject);
    return myProject;
}

const createProject = async (name, issue) => {
    const myProject = await newProject.create({ name: name, issues: [ issue ] }).catch((e) => { throw new Error(e) });
    myProject.save();
    console.log(myProject);
    return myProject;
}

const getCorrespondingIssues = async (projectName, { _id, issue_title, issue_text, created_by, assigned_to, status_text, open }) => {
    let myIssues;
    newProject.find({ name: projectName }).then((err, data) => {
        console.log(err);
    })
}

const Project = {
    Project: newProject,
    findProject: findProject,
    createProject: createProject,
    getCorrespondingIssues: getCorrespondingIssues
}


module.exports = Project;
const mongoose = require('mongoose');
const { IssueSchema } = require('./Issue')

// console.log(IssueSchema)

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issues: { type: [ IssueSchema ] }
})

const newProject = new mongoose.model('Project', ProjectSchema);


const findProject = async (name) => {
    const myProject = await newProject.find({ name: name }).catch((e) => { throw new Error(e) });
    // console.log(myProject);
    return myProject;
}

const createProject = async (name, issue) => {
    const myProject = await newProject.create({ name: name, issues: [ issue ] }).catch((e) => { throw new Error(e) });
    myProject.save();
    // console.log(myProject);
    return myProject;
}

const getCorrespondingIssues = async (projectName, { _id, issue_title, issue_text, created_by, assigned_to, status_text, open }) => {
    let myIssues;
    // console.log({ _id, issue_title, issue_text, created_by, assigned_to, status_text, open })
    try {
        myIssues = await newProject.aggregate(
            [
                { $match: { name: projectName } },
                { $unwind: "$issues" },
                (_id != undefined) ? ({ $match: { "issues._id": ObjectId(_id) } }) : ({ $match: {} }),
                (open != undefined) ? ({ $match: { "issues.open": open } }) : ({ $match: {} }),
                (issue_title != undefined) ? ({ $match: { "issues.issue_title": issue_title } }) : ({ $match: {} }),
                (issue_text != undefined) ? ({ $match: { "issues.issue_text": issue_text } }) : ({ $match: {} }),
                (created_by != undefined) ? ({ $match: { "issues.created_by": created_by } }) : ({ $match: {} }),
                (assigned_to != undefined) ? ({ $match: { "issues.assigned_to": assigned_to } }) : ({ $match: {} }),
                (status_text != undefined) ? ({ $match: { "issues.status_text": status_text } }) : ({ $match: {} }),
            ]
        ).exec();
    } catch (err) {
        console.log(err)
    }

    if (!myIssues) // NO DATA FOUND
    {
        return [];
    } else {
        myIssues = myIssues.map((item) => item.issues);
    }
    // console.log(myIssues)
    return myIssues;
}

// const updateIssue = async (projectName,issueParams) => {
//     let myProject = await newProject.findOne({name:projectName})

// }

const Project = {
    Project: newProject,
    findProject: findProject,
    createProject: createProject,
    getCorrespondingIssues: getCorrespondingIssues
}


module.exports = Project;
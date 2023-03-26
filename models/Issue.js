const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: Date,
    updated_on: Date,
    created_by: { type: String, required: true },
    assigned_to: String,
    open: Boolean,
    status_text: String
})

const IssueModel = new mongoose.model('Issue', IssueSchema);

const createIssue = async (title, text, created_by, assigned_to, status_text) => {
    let myIssue;
    try {
        myIssue = await IssueModel.create({
            issue_title: title,
            issue_text: text,
            created_on: new Date(),
            updated_on: new Date(),
            created_by: created_by,
            assigned_to: assigned_to || "",
            open: true,
            status_text: status_text || ""
        })
        myIssue.save();
    } catch (err) {
        console.log('Error creating the Issue');
        console.log(err)
    }
    console.log('new Issue Created');
    console.log(myIssue)
    return myIssue;
}

const Issues = {
    IssueSchema: IssueSchema,
    Issues: IssueModel,
    createIssue: createIssue
}

module.exports = Issues;
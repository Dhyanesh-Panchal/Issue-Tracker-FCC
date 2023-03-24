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

const newIssue = new mongoose.model('Issue', IssueSchema);

const Issues = {
    IssueSchema: IssueSchema,
    Issues: newIssue
}

module.exports = Issues;
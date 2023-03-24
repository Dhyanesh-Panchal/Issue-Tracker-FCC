'use strict';

const { Project, findProject, createProject, getCorrespondingIssues } = require('../models/Project');
const { Issues } = require('../models/Issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      let project = req.params.project;
      // console.log(req.query)
      let issueParams = req.query;

      const myIssues = await getCorrespondingIssues(project, issueParams);




    })

    .post(async function (req, res) {
      let project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      // CHECK IF REQUIRED FIELDS MISSING
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }

      const newIssue = new Issues({
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || ""
      })
      newIssue.save();

      let myProject = await findProject(project);

      // PROJECT IS EMPTY, CREATE NEW ONE
      if (myProject.length == 0) {
        myProject = await createProject(project, newIssue);
      }
      else {
        myProject = myProject[ 0 ]; // GET THE 1st ONE
        myProject.issues.push(newIssue);
        myProject.save();
      }
      // console.log('Done')

      res.json(newIssue)
    })

    .put(function (req, res) {
      let project = req.params.project;

    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};

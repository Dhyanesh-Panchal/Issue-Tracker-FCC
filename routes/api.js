'use strict';

const { Project, findProject, createProject, getCorrespondingIssues, updateIssue } = require('../models/Project');
const { Issues, createIssue } = require('../models/Issue');
const { ObjectId } = require('mongodb');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      // console.log('\t\tInside GET Request')
      // console.log('\t\t' + req.url)
      let project = req.params.project;
      // console.log(req.query)
      let issueParams = req.query;

      const myIssues = await getCorrespondingIssues(project, issueParams);
      res.json(myIssues)



    })

    .post(async function (req, res) {
      // console.log('\t\tInside POST Request')
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

      const newIssue = await createIssue(issue_title, issue_text, created_by, assigned_to, status_text);
      // console.log(newIssue);

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

    .put(async function (req, res) {

      console.log('\n\n\nPUT REQUEST')
      let project = req.params.project;

      let issueParams = { ...req.body };
      let _id = issueParams._id;
      console.log(issueParams)

      if (!issueParams._id) {
        console.log('missing _id\n\n')
        res.json({ error: 'missing _id' });
        return;
      }

      if (Object.keys(issueParams).length == 1) {
        // ONLY ID is given, no update parameters
        console.log('no update field(s) sent\n\n')
        res.json({ error: 'no update field(s) sent', '_id': _id })
        return;
      }



      try {
        let myProject = await findProject(project);
        let issuedData = myProject[ 0 ].issues.id(issueParams._id);

        console.log(myProject);
        console.log('\nIssue:', issuedData);
        if (myProject.length == 0 || !issuedData) {
          console.log('\t\t\tCouldnt Update');
          res.json({ error: 'could not update', '_id': _id })
          return;
        }



        issuedData.issue_title = issueParams.issue_title || issuedData.issue_title;
        issuedData.issue_text = issueParams.issue_text || issuedData.issue_text;
        issuedData.created_by = issueParams.created_by || issuedData.created_by;
        issuedData.assigned_to = issueParams.assigned_to || issuedData.assigned_to;
        issuedData.status_text = issueParams.status_text || issuedData.status_text;
        issuedData.open = issueParams.open || issuedData.open;
        issuedData.updated_on = new Date();

        myProject[ 0 ].save().catch(e => {
          res.json({ error: 'could not update', '_id': _id })
          return;
        });
      } catch (err) {
        console.log('\t\t\tCouldnt Update');
        res.json({ error: 'could not update', '_id': _id })
        return;
      }

      console.log("Succesfully updated!");
      res.json({ result: 'successfully updated', '_id': issueParams._id })
    })

    .delete(async function (req, res) {
      console.log('\t\t\tInside DELETE Request')
      let project = req.params.project;

      const id = req.body._id;
      // console.log('\n\n\t', id)
      if (!id) {
        console.log('missing _id\n\n')
        res.json({ error: 'missing _id' });
        return;
      }

      let myProject = await findProject(project);
      // console.log(myProject[ 0 ].issues.id(id));
      if (!myProject[ 0 ].issues.id(id)) {
        // console.log('could not delete');
        res.json({ error: 'could not delete', '_id': id });
        return;
      }
      let prevLength = myProject.length;
      myProject[ 0 ].issues = myProject[ 0 ].issues.filter((item) => item._id != new ObjectId(id));

      if (prevLength == myProject[ 0 ].issues.length) {
        // console.log('could not delete');
        res.json({ error: 'could not delete', '_id': id });
        return;
      }

      myProject[ 0 ].save();

      res.json({ result: 'successfully deleted', '_id': id })
    });

};

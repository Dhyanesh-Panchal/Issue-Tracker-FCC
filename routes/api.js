'use strict';

const { Project, findProject, createProject, getCorrespondingIssues } = require('../models/Project');
const { Issues, createIssue } = require('../models/Issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      console.log('\t\tInside GET Request')
      console.log('\t\t' + req.url)
      let project = req.params.project;
      // console.log(req.query)
      let issueParams = req.query;

      const myIssues = await getCorrespondingIssues(project, issueParams);
      res.json(myIssues)



    })

    .post(async function (req, res) {
      console.log('\t\tInside POST Request')
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
      console.log(req.body)
      let issueParams = req.body;

      if (!issueParams._id) {
        console.log('missing _id\n\n')
        res.json({ error: 'missing _id' });
        return;
      }

      if (Object.keys(issueParams).length == 1) {
        // ONLY ID is given, no update parameters
        console.log('no update field(s) sent\n\n')
        res.json({ result: 'no update field(s) sent', '_id': issueParams._id })
        return;
      }

      Project.findOne({ name: project }, (err, projectData) => {
        if (err || !projectData) {
          res.json({ error: 'could not update', '_id': issueParams._id });
          return;
        }
        else {
          let issuedData = projectDataissues.id(issueParams._id);
          if (!issuedData) {
            res.json({ error: 'could not update', '_id': issueParams._id });
            return;
          }

          issuedData.issue_title = issueParams.issue_title || issuedData.issue_title;
          issuedData.issue_text = issueParams.issue_text || issuedData.issue_text;
          issuedData.created_by = issueParams.created_by || issuedData.created_by;
          issuedData.assigned_to = issueParams.assigned_to || issuedData.assigned_to;
          issuedData.status_text = issueParams.status_text || issuedData.status_text;
          issuedData.open = issueParams.open || issuedData.open;
          issuedData.updated_on = new Date();

          projectData.save((err, data) => {
            if (err || !data) {
              res.json({ error: 'could not update', '_id': issueParams._id });
              return;
            }
            else {
              res.json({ result: 'successfully updated', '_id': issueParams._id });
              return;
            }
          })
        }
      })

      // let myProject = await findProject(project);
      // let issuedData = myProject[ 0 ].issues.id(issueParams._id)
      // console.log(myProject);
      // console.log('\nIssue:', issuedData);
      // if (myProject.length == 0 || !issuedData) {
      //   console.log('\t\t\tCouldnt Update');
      //   res.json({ error: 'could not update', '_id': issueParams._id })
      //   return;
      // }

      // issuedData.issue_title = issueParams.issue_title || issuedData.issue_title;
      // issuedData.issue_text = issueParams.issue_text || issuedData.issue_text;
      // issuedData.created_by = issueParams.created_by || issuedData.created_by;
      // issuedData.assigned_to = issueParams.assigned_to || issuedData.assigned_to;
      // issuedData.status_text = issueParams.status_text || issuedData.status_text;
      // issuedData.open = issueParams.open || issuedData.open;
      // issuedData.updated_on = new Date();

      // myProject.save((err) => {
      //   if (err) {
      //     res.json({ error: 'could not update', '_id': issueParams._id });
      //     return;
      //   }
      //   else {
      //     res.json({ result: 'successfully updated', '_id': issueParams._id })
      //   }
      // });
    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};

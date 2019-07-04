tutorial can be found here https://medium.com/p/d2c9cdd980ec/edit

todo / nice to haves:
  - Determine what caused a failure if it happened
  - Generate small image of graph showing progress of build performance
  
  
# AgeRate Engineering: Devops -Google Cloud Build x Slack Notification



*In this article we show you how to set up a sweet cloud function that sends you a slack notification about your recent GCP cloud build.*

![](https://cdn-images-1.medium.com/max/2068/1*ssrDVEXszc6cBGjhiVoOGw.png)

If you want to get right into the code and skip the high level tutorial you can just go right ahead into the github repo [here](https://github.com/agerate-engineering/gcp-slack-notification.git).

<iframe src="https://medium.com/media/7a6bf3d7dcab2127026d237ce4945433" frameborder=0></iframe>

Enabling a build pipeline for any large software project will make your life so much easier. No more manual deploys, no more entering commands incorrectly or in the wrong order. A build pipeline makes things consistent, boring and most importantly automated ❤

## Transparency is a build pipelines best friend

collecting logs, metrics and diagnostics on how every build performs is a major benefit from your build pipeline and it keeps your developers and product people happy.

To keep you in the know about the status of your GCP cloud build, we created a cloud function that you can deploy to any cloud build project so you can keep track if a deployment was a success and how long each build step took.

### Setup Requirements

1. You have gcloud setup on your terminal and are logged in. If not click [here](https://cloud.google.com/sdk/docs/) to get yourself setup. Don’t forget to enable the Cloud Functions, Cloud Pub/Sub, and Kubernetes Engine APIs and Billing for your project.

1. have a GCP project that has enabled automated builds via build triggers through source code repository updates. If not click [here](https://cloud.google.com/cloud-build/docs/running-builds/automate-builds) to get yourself setup.

1. Installed and signed into slack on your machine. Create a new slack app by clicking [here](https://api.slack.com/apps?new_app=1). name the app w.e you want (gcp-slace-notification, and select your team workspace). Click Incoming Webhooks and Enable. Click Add new Webhook to team, Authorize and chose a slack channel. (I would create a new slack channel called active-development to seperate build notifications from other channels to not pollute them). Click accept/authorize. Finally a new webhook was created for your team. Copy and paste the webhook url as you will need it for later.

Once the above steps are done we are ready to create your new cloud function for slack notifications!

you can do a git clone from the repository [here](https://github.com/agerate-engineering/gcp-slack-notification.git) or you can create a new directory and copy the files and scripts below.

4 main files: .env.yaml, deploy.sh, index.js, package.json

### .env.yaml

This is your main configuration file. Add your slack webhook and repo names in the appropriate properties. add or remove repo names as necessary. **It is best to not check this file into github/source code.**

    SLACK_WEBHOOK_URL: 

    FRONTEND_REPO_NAME:

    BACKEND_REPO_NAME:

    // paste slack webhook url

    // paste repo name in the follow format github_org-name_repo_name (ex. github_agerate-engineering_vessel-backend)

    // paste repo name in the follow format github_org-name_repo_name (ex. github_agerate-engineering_vessel-backend)

### deploy.sh

This is an easy script to deploy your functions into GCP. all the configurations have been set for you. Don’t forget to swap out <DEV_PROJECT_ID> and <PROD_PROJECT_ID> with your own project id’s

    echo 'deploying slack-build-notification hook to development environment' 

    gcloud functions deploy slack-build-notification --env-vars-file=.env.yaml --entry-point=subscribe --runtime=nodejs8 --trigger-topic cloud-builds --project=<DEV_PROJECT_ID> 

    echo 'deploying slack-build-notification hook to production environment'

    gcloud functions deploy slack-build-notification --env-vars-file=.env.yaml --entry-point=subscribe --runtime=nodejs8 --trigger-topic cloud-builds --project=<PROD_PROJECT_ID>

### index.js

Here is the meat of the cloud function! Just copy and paste this one. No need for configuration. Feel free to modify and adapt to your own needs.

<iframe src="https://medium.com/media/8fa1429a840de3d05e141edeacdd0213" frameborder=0></iframe>

### package.json

Here are the dependencies needed for the cloud function, don’t forget to add this! No need to do an npm install, GCF takes the package.json file and will download the node_modules for you.

<iframe src="https://medium.com/media/fd972ffa4fc3d7baf7b392442b2f4874" frameborder=0></iframe>

### Deploy

Thats it! run the following command

![](https://cdn-images-1.medium.com/max/2148/1*HuEBumG3jNrga5dya9B6WQ.png)

And if your gcloud terminal was configured correctly you should be able to see your new function in GCP under cloud functions!

heres what the finished product looks like in action.

![](https://cdn-images-1.medium.com/max/2752/1*rpCtUWoihcq2kNurfQ9lFA.png)

Any build that you configured within the function that goes through cloud build will notify you on slack. It will tell you if it was a successful build or not, the name of the source repo, deployment environment and breakdown of each build step and how long it took!

Hopefully you found this helpful and until next time!

![](https://cdn-images-1.medium.com/max/2000/1*6BJ5slUGJm0tLI_rCBGA2w.png)

AgeRate is a Biotech Startup in Hamilton Ontario on focus on creating innovative next generation epigenetic tests. If you want to read more engineering, product design and R&D articles feel free to follow us!

If you are interested in our product launch in this summer then subscribe for exclusive access to pre-order prices (and to stay in-the-know on what we’re doing)

<iframe src="https://medium.com/media/528efcd5e7615a9e3818739f705c85fb" frameborder=0></iframe>


const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const FRONTEND_REPO_NAME = proces.env.FRONTEND_REPO_NAME;
const BACKEND_REPO_NAME = proces.env.BACKEND_REPO_NAME;

const dateFormat = require('dateformat');
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

module.exports.subscribe = (event, callback) => {
    const build = JSON.parse(new Buffer(event.data, 'base64').toString());
    if (build.status === 'SUCCESS' || build.status === 'FAILURE') {
        const message = generateSlackMessage(build);
        webhook.send(message, callback);
    } else {
        console.log(`build status ${build.status}`);
        console.log(`build info ${JSON.stringify(build)}`);
    }
};

const generateSlackMessage = (build) => {

    let repoName = 'UNKOWN REPONAME';

    if (build.source.repoSource.repoName === FRONTEND_REPO_NAME) repoName = "Frontend";
    if (build.source.repoSource.repoName === BACKEND_REPO_NAME) repoName = "Backend";

    let environment = 'UNKOWN BRANCH'

    if (build.source.repoSource.branchName === 'develop') environment = 'development';
    if (build.source.repoSource.branchName === 'master') environment = 'production';

    let fields = []

    /** time to deployment */

    const startTime = dateFormat(build.startTime, "h:MM:ss TT");
    const finishTime = dateFormat(build.finishTime, "h:MM:ss TT");
    const timeDifference = timeDiff(build.startTime, build.finishTime);

    let deployment_time_field = {
        title: 'deployment time: ',
        value: `${startTime} -> ${finishTime} (${timeDifference})`
    }

    fields.push(deployment_time_field)

    /** build steps */
    let deployment_step_fields = generateStepTimes(build.steps)

    fields = fields.concat(deployment_step_fields)

    let message = {
        text: `\`${build.status}\` ${repoName} to ${environment} environment`,
        mrkdwn: true,
        attachments: [
            {
                title: `build id ${build.id}`,
                title_link: build.logUrl,
                fields: fields
            }
        ]
    };

    return message
}

const generateStepTimes = (steps) => {
    stepTimes = [];
    steps.forEach((step) => {
        if (step.status === 'SUCCESS') {
            stepTimes.push({
                title: `${step.id}`,
                value: `\`${step.status}\` -> \`${timeDiff(step.timing.startTime, step.timing.endTime)}\``
            })
        } else {
            stepTimes.push({
                title: `${step.id}`,
                value: `\`${step.status}\``
            })
        }
    })
    return stepTimes;
}

const timeDiff = (startTime, finishTime) => {
    let diff = new Date(finishTime) - new Date(startTime);
    if (diff > 60e3) return `${Math.floor(diff / 60e3)} minutes`
    else return `${Math.floor(diff / 1e3)} seconds`
}

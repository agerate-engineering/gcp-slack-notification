echo 'deploying slack-build-notification hook to development environment'
gcloud functions deploy slack-build-notification --env-vars-file=.env.yaml --entry-point=subscribe --runtime=nodejs8 --trigger-topic cloud-builds --project=<DEV_PROJECT_ID>

echo 'deploying slack-build-notification hook to production environment'
gcloud functions deploy slack-build-notification --env-vars-file=.env.yaml --entry-point=subscribe --runtime=nodejs8 --trigger-topic cloud-builds --project=<PROD_PROJECT_ID>

// This file needs to be js so that serverless.yaml can read it
module.exports.Constants = () => ({
  MaxQueryComplexity: process.env.MAX_QUERY_COMPLEXITY,
  FacebookAppId: process.env.FACEBOOK_APP_ID,
  FacebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  UserRoleArn: process.env.USER_ROLE_ARN,
  DeploymentBucketName: process.env.DEPLOYMENT_BUCKET_NAME,
  StorageBucketName: process.env.STORAGE_BUCKET_NAME,
  StorageBucketDirectory: 'storage',
  StorageBucketUserDirectory: 'users',
  StorageBucketGroupsDirectory: 'groups',
  StorageBucketCampaignDirectory: 'campaign',
  StorageBucketPostsDirectory: 'posts',
  StorageBucketVideosDirectory: 'videos',
  StorageBucketTranscodedMediaDirectory: 'generated-storage',
  StorageBaseURL: process.env.STORAGE_BASE_URL,
  ElasticSearchDomain: process.env.ELASTIC_SEARCH_DOMAIN,
  ElasticGroupIndex: process.env.ELASTIC_GROUP_INDEX,
  ElasticTranscoderPipelineId: process.env.ELASTIC_TRANSCODER_PIPELINE_ID,
  TableNames: {
    Main: process.env.TABLE_NAME_MAIN,
    Relations: process.env.TABLE_NAME_RELATIONS,
  },
})

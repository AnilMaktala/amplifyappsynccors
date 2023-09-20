import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper'
import * as cdk from 'aws-cdk-lib'
import * as wafv2 from 'aws-cdk-lib/aws-wafv2'
import * as appsync from 'aws-cdk-lib/aws-appsync'
import { Construct } from 'constructs'
import type { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref'

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props)
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    })

    const webAcl = new wafv2.CfnWebACL(this, 'MyCDKWebAclG', {
      defaultAction: {
        block: {},
      },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'MetricForWebACLCDK',
        sampledRequestsEnabled: true,
      },
      name: 'MyCDKWebAcl',
      rules: [
        {
          name: 'Common',
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              name: 'AWSManagedRulesCommonRuleSet',
              vendorName: 'AWS',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'MetricForWebACLCDK-Common',
            sampledRequestsEnabled: true,
          },
          overrideAction: {
            none: {},
          },
        },
        {
          name: 'AllowOnlyCloudfront',
          priority: 1,
          action: {
            allow: {},
          },
          statement: {
            byteMatchStatement: {
              // only from 'https://main.d355fqa8wxcozl.amplifyapp.com/'
              fieldToMatch: {
                singleHeader: {
                  Name: 'Origin',
                },
              },
              textTransformations: [
                {
                  priority: 0,
                  type: 'NONE',
                },
              ],
              positionalConstraint: 'EXACTLY',
              searchString: 'https://main.d355fqa8wxcozl.amplifyapp.com',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'MetricForWebACLCDK-Cloudfront',
            sampledRequestsEnabled: true,
          },
        },
      ],
    })

    const { api }: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
        this,
        amplifyResourceProps.category,
        amplifyResourceProps.resourceName,
        [{ category: 'api', resourceName: 'amplifyappsynccors' }]
      )

    const myAppsyncApi = appsync.GraphqlApi.fromGraphqlApiAttributes(
      this,
      'MyReferencedApi',
      {
        graphqlApiId: api.amplifyappsynccors.GraphQLAPIIdOutput,
      }
    )

    new wafv2.CfnWebACLAssociation(this, 'MyCDKWebACLAssociation', {
      // replace this once it is fixed
      // resourceArn: myAppsyncApi.arn,
      resourceArn:
        'arn:aws:appsync:us-east-1:814763596509:apis/uv4paaa6t5fodkxvzjgkcz3u6e',
      webAclArn: webAcl.attrArn,
    })
  }
}

import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import * as cdk from "aws-cdk-lib";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";
import type { AmplifyDependentResourcesAttributes } from "../../types/amplify-dependent-resources-ref";

export const AMPLIFY_HOSTING_URL =
  "https://main.d3gi9w5l4eotbp.amplifyapp.com/";

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    const webAcl = new wafv2.CfnWebACL(this, "MyCDKWebAcl", {
      defaultAction: {
        block: {},
      },
      scope: "REGIONAL",
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: "MetricForWebACLCDK",
        sampledRequestsEnabled: true,
      },
      name: "MyCDKWebAcl",
      rules: [
        {
          name: "Common",
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              name: "AWSManagedRulesCommonRuleSet",
              vendorName: "AWS",
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: "MetricForWebACLCDK-Common",
            sampledRequestsEnabled: true,
          },
          overrideAction: {
            none: {},
          },
        },
        {
          name: "AllowOnlyAmplifyHosting",
          priority: 1,
          action: {
            allow: {
              // customRequestHandling: {
              //   insertHeaders: [
              //     {
              //       name: 'Access-Control-Allow-Origin',
              //       value: AMPLIFY_HOSTING_URL,
              //     },
              //   ],
              // },
            },
          },
          statement: {
            byteMatchStatement: {
              // only from 'https://main.d355fqa8wxcozl.amplifyapp.com/'
              fieldToMatch: {
                singleHeader: {
                  Name: "Origin",
                },
              },
              textTransformations: [
                {
                  priority: 0,
                  type: "NONE",
                },
              ],
              positionalConstraint: "EXACTLY",
              searchString: AMPLIFY_HOSTING_URL,
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: "MetricForWebACLCDK-Cloudfront",
            sampledRequestsEnabled: true,
          },
        },
      ],
    });

    const { api }: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
        this,
        amplifyResourceProps.category,
        amplifyResourceProps.resourceName,
        [{ category: "api", resourceName: "amplifyappsynccors" }]
      );

    new wafv2.CfnWebACLAssociation(this, "MyCDKWebACLAssociation", {
      resourceArn: cdk.Fn.join(":", [
        "arn:aws:appsync",
        cdk.Aws.REGION,
        cdk.Aws.ACCOUNT_ID,
        cdk.Fn.join("/", [
          "apis",
          cdk.Fn.ref(api.amplifyappsynccors.GraphQLAPIIdOutput),
        ]),
      ]),
      webAclArn: webAcl.attrArn,
    });
  }
}

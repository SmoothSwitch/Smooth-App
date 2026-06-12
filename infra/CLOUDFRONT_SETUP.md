# CloudFront CDN + WAF Deployment Guide — SmoothSwitch

## Prerequisites

- AWS CLI installed and configured (`aws configure`)
- IAM permissions for CloudFront, WAF, and CloudFormation
- The **API Gateway URL** from Kosi (Track A deployment)

---

## 1. Deploy the CloudFormation Stack

```bash
aws cloudformation deploy \
  --template-file infra/cloudfront-waf.yml \
  --stack-name smoothswitch-cdn-waf \
  --parameter-overrides \
      APIGatewayOriginDomain="YOUR_API_GATEWAY_DOMAIN.execute-api.eu-west-1.amazonaws.com" \
      Environment=production \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

> **Note**: CloudFront + WAF (CLOUDFRONT scope) must be deployed in `us-east-1`, even though Origin Shield uses `eu-west-1`.

---

## 2. Get the CloudFront Domain

```bash
aws cloudformation describe-stacks \
  --stack-name smoothswitch-cdn-waf \
  --query "Stacks[0].Outputs" \
  --output table
```

This will output:
- `CloudFrontDomainName` — e.g. `d1234abcd.cloudfront.net`
- `CloudFrontDistributionId` — for future updates
- `WAFWebACLArn` — for monitoring

---

## 3. DNS Configuration (Optional)

If you have a custom domain (e.g. `api.smoothswitch.io`):

1. Request an SSL certificate in **ACM** (us-east-1 region)
2. Add the custom domain as a CNAME alias in the CloudFront distribution
3. Update your DNS provider to point `api.smoothswitch.io` → `d1234abcd.cloudfront.net`

---

## 4. Caching Rules Summary

| Path Pattern | TTL | Reason |
|---|---|---|
| `/health` | 30s | Reduces origin load for health checks |
| `/auth/*` | 0s | Sensitive auth tokens, never cache |
| `/wallet/*` | 0s | Financial data, never cache |
| `/payments/*` | 0s | Payment processing, never cache |
| Everything else | 0s | API responses default to no-cache |

---

## 5. WAF Rules Summary

| Rule | Type | Action |
|---|---|---|
| AWSManagedRulesCommonRuleSet | Managed | Block XSS, bad bots |
| AWSManagedRulesSQLiRuleSet | Managed | Block SQL injection |
| AWSManagedRulesKnownBadInputsRuleSet | Managed | Block known exploits |
| RateLimitRule | Rate-based | Block IP after 2000 req/5min |

---

## 6. Verify Deployment

```bash
# Test the CloudFront endpoint
curl -I https://d1234abcd.cloudfront.net/health

# Verify WAF is active (check for x-amzn-waf headers)
curl -v https://d1234abcd.cloudfront.net/health 2>&1 | grep -i waf
```

---

## Pending from Kosi
- [ ] API Gateway URL (to replace the placeholder origin domain)
- [ ] AWS Console access for deployment

# Project02: `Filter Image Starter Code` On Amazon Web Service
### The Goal of Project Is That:
1) Get the way creating a Rest API and how does it work on NodeJS
2) Get the way creating a Elastic BeanTalks servier and How to Deploy a Rest API on it

### The Following Steps
1) Fork source code from https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code

2) Create a new project name `Project02-Filter-Image-Service`
3) Jump in to `Server.ts` and create a new `filteredimage`. ( the full api endpoint: `http://localhost:8082/filteredimage`)
4) Here is the detail of this endpoint
```
 // http://localhost:8082/filteredimage endpoint
  app.get( "/filteredimage/", async (req: express.Request, res: express.Response)=>{
    
    // Check validation image_url
    const image_url = req.query.image_url;
    let valid = (image_url?.length !== 0);
    if(!valid) {
      return res.status(400).send("The image_url parameter is required.");
    }

    // Receive image_url parameter and then get & process image by FilterImageFromURL service
    await filterImageFromURL(image_url)
      .then(imagePath => {

        // Image is processed successful
        return res.status(200).sendFile(imagePath, error => {
          if (!error) {
            
            // Delete images file on locally
            deleteLocalFiles([imagePath]);
          }
        });
      }).catch(() => {

        // Cannot process image on FilterImageFromURL service
        return res.status(422).send("Processing image got error.");
      });
  });
```
5) Open Terminator tool and navigate to directory reside the project, looks like this
```
Directory: C:\Courses\Cloud_Developer\projects\aws-cloud-developer-2023\Project02-Filter-Image-Service
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----          4/2/2023   9:56 PM                images
d-----          4/2/2023   2:24 PM                node_modules
d-----          4/2/2023   1:11 PM                src
-a----          4/2/2023   9:07 PM            630 .gitignore
-a----          4/2/2023   2:24 PM          92385 package-lock.json
-a----          4/2/2023   2:24 PM           1030 package.json
-a----          4/2/2023   9:59 PM            698 README.md
```
6) Execute statement `npm run build`
7) Execute statement `npm run dev` we will have as below:
```
PS C:\Courses\Cloud_Developer\projects\aws-cloud-developer-2023\Project02-Filter-Image-Service> npm run dev

> Project02-Filter-Image-Service@1.0.0 dev
> ts-node-dev --respawn --transpile-only ./src/server.ts

[INFO] 22:09:38 ts-node-dev ver. 2.0.0-0 (using ts-node ver. 10.9.1, typescript ver. 3.9.10)
server running http://localhost:8082
press CTRL+C to stop server
```
8) Open Postman tool and let's verify the `filteredimage` endpoint on locally
[Verify `filteredimage` endpoint with Postman tool](https://github.com/HungDoan2023/aws-cloud-developer-2023/tree/main/Project02-Filter-Image-Service/images/verify-filteredimage-endpoint-postman.png)   

9) Create a Elastic Beanstalk Service and Configuration with NodeJS
9.1)  Create a deployable build package
_ Navigate to current project and execute statement `npm run build`:
```
PS C:\Courses\Cloud_Developer\Projects\aws-cloud-developer-2023\Project02-Filter-Image-Service> npm run build

> Project02-Filter-Image-Service@1.0.0 build
> npm run clean && tsc && mkdir www\tmp\ && cd www && zip -r Filter-Image-Archive.zip . && cd ..


> Project02-Filter-Image-Service@1.0.0 clean
> rimraf www/ || true

  adding: server.js (196 bytes security) (deflated 61%)
  adding: server.js.map (196 bytes security) (deflated 64%)
  adding: tmp/ (216 bytes security) (stored 0%)
  adding: util/ (216 bytes security) (stored 0%)
  adding: util/util.js (196 bytes security) (deflated 62%)
  adding: util/util.js.map (196 bytes security) (deflated 56%)

PS C:\Courses\Cloud_Developer\Projects\aws-cloud-developer-2023\Project02-Filter-Image-Service>
```
9.2) Install [EB CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) (if it's not available)
9.3) At current directory project. Execute statement: `eb init`
```
PS C:\Courses\Cloud_Developer\Projects\aws-cloud-developer-2023\Project02-FilterService> eb init

Select a default region
1) us-east-1 : US East (N. Virginia)
2) us-west-1 : US West (N. California)
3) us-west-2 : US West (Oregon)
.....
.....
.....
22) af-south-1 : Africa (Cape Town)
23) ap-southeast-3 : Asia Pacific (Jakarta)
(Y/n): Y
Select a platform branch.
1) Node.js 16 running on 64bit Amazon Linux 2
2) Node.js 14 running on 64bit Amazon Linux 2
(default is 1): 1

Cannot setup CodeCommit because there is no Source Control setup, continuing with initialization
Do you want to set up SSH for your instances?
(Y/n): n

Enter Application Name
(default is "Project02-Filter-Image-Service"): Project02-Filter-Image-Service
```
9.4) Jump into config.yml file on .elasticbeanstalk directory. Add some lines as below:
```
deploy:
artifact: ./www/Filter-Image-Archive.zip
```
[Modify config.yml file](https://github.com/HungDoan2023/aws-cloud-developer-2023/tree/main/Project02-Filter-Image-Service/images/modify-config-elastic-beanstalk.png)


9.5) Create `eb create`
```
Enter Environment Name
(default is Project02-Filter-Image-Service-dev2): 
Enter DNS CNAME prefix
(default is Project02-Filter-Image-Service-dev2): 

Select a load balancer type
1) classic
2) application
3) network
(default is 2): 2


Would you like to enable Spot Fleet requests for this environment? (y/N): y
Enter a list of one or more valid EC2 instance types separated by commas (at least two instance types are recommended).
(Defaults provided on Enter): t3.micro

Uploading Project02-Filter-Image-Service/app-230403_132754523949.zip to S3. This may take a while.
Upload Complete.
Environment details for: Project02-Filter-Image-Service-dev2
  Application name: Project02-Filter-Image-Service
  Region: us-east-1
  Deployed Version: app-230403_132754523949
  Environment ID: e-guukwmke7p
  Platform: arn:aws:elasticbeanstalk:us-east-1::platform/Node.js 16 running on 64bit Amazon Linux 2/5.7.0
  Tier: WebServer-Standard-1.0
  CNAME: Project02-Filter-Image-Service-dev2.us-east-1.elasticbeanstalk.com
  Updated: 2023-04-03 06:27:59.468000+00:00
Printing Status:
2023-04-03 06:27:58    INFO    createEnvironment is starting.
2023-04-03 06:27:59    INFO    Using elasticbeanstalk-us-east-1-215475018024 as Amazon S3 storage bucket for environment data.
2023-04-03 06:28:20    INFO    Created security group named: sg-09b309aa9c4c83578
2023-04-03 06:28:36    INFO    Created security group named: awseb-e-guukwmke7p-stack-AWSEBSecurityGroup-1GEXESL2H17TD
2023-04-03 06:28:36    INFO    Created target group named: arn:aws:elasticloadbalancing:us-east-1:215475018024:targetgroup/awseb-AWSEB-CNLYGBAAGIBK/8bfbc3646fc7f3bf
2023-04-03 06:29:07    INFO    Created Auto Scaling group named: awseb-e-guukwmke7p-stack-AWSEBAutoScalingGroup-U07OKDKZ8U5D
2023-04-03 06:29:07    INFO    Waiting for EC2 instances to launch. This may take a few minutes.
2023-04-03 06:29:07    INFO    Created Auto Scaling group policy named: arn:aws:autoscaling:us-east-1:215475018024:scalingPolicy:f97ff98e-5ab1-4712-8def-a3f5e0209961:autoScalingGroupName/awseb-e-guukwmke7p-stack-AWSEBAutoScalingGroup-U07OKDKZ8U5D:policyName/awseb-e-guukwmke7p-stack-AWSEBAutoScalingScaleDownPolicy-eYxmWMpui70Z
2023-04-03 06:29:07    INFO    Created Auto Scaling group policy named: arn:aws:autoscaling:us-east-1:215475018024:scalingPolicy:74762cc1-c3da-443b-b021-f10e39dcadcf:autoScalingGroupName/awseb-e-guukwmke7p-stack-AWSEBAutoScalingGroup-U07OKDKZ8U5D:policyName/awseb-e-guukwmke7p-stack-AWSEBAutoScalingScaleUpPolicy-hp7Q80c4zZ1J
2023-04-03 06:29:22    INFO    Created CloudWatch alarm named: awseb-e-guukwmke7p-stack-AWSEBCloudwatchAlarmLow-1LE4HJJ18KM6
2023-04-03 06:29:22    INFO    Created CloudWatch alarm named: awseb-e-guukwmke7p-stack-AWSEBCloudwatchAlarmHigh-FZK7A0OUOYIU
2023-04-03 06:30:27    INFO    Created load balancer named: arn:aws:elasticloadbalancing:us-east-1:215475018024:loadbalancer/app/awseb-AWSEB-1JURLAWED82WJ/c044142decef9c4b
2023-04-03 06:30:27    INFO    Created Load Balancer listener named: arn:aws:elasticloadbalancing:us-east-1:215475018024:listener/app/awseb-AWSEB-1JURLAWED82WJ/c044142decef9c4b/a224d367d8f43fed
2023-04-03 06:30:58    INFO    Instance deployment completed successfully.
2023-04-03 06:31:15    INFO    Application available at Project02-Filter-Image-Service-dev2.us-east-1.elasticbeanstalk.com.
2023-04-03 06:31:15    INFO    Successfully launched environment: Project02-Filter-Image-Service-dev2
```
9.6) Check Elastic Beanstalk Application and Environment
[Elastic Beanstalk Application Health Check](https://github.com/HungDoan2023/aws-cloud-developer-2023/tree/main/Project02-Filter-Image-Service/images/Elastic-Beanstalk-Application-Health-Check.PNG)
[Elastic Beanstalk Environment](https://github.com/HungDoan2023/aws-cloud-developer-2023/tree/main/Project02-Filter-Image-Service/images/Elastic-Beanstalk-Environment-1.PNG)

9.7) Deploy a zip file on AWS Elastic Beanstalk
Execute statement `eb deploy Project02-Filter-Image-Service-dev2` as log information below:
```
PS C:\Courses\Cloud_Developer\Projects\aws-cloud-developer-2023\Project02-Filter-Image-Service> eb deploy Project02-Filter-Image-Service-dev2
Uploading Project02-Filter-Image-Service/app-230403_145505698935.zip to S3. This may take a while.
Upload Complete.
2023-04-03 07:55:08    INFO    Environment update is starting.      
2023-04-03 07:55:12    INFO    Deploying new version to instance(s).
2023-04-03 07:55:28    INFO    Instance deployment completed successfully.
2023-04-03 07:55:35    INFO    New application version was deployed to running EC2 instances.
2023-04-03 07:55:35    INFO    Environment update completed successfully.
```
If we have any code change, we are able to build and then deploy code change to running application with `eb deploy`

9.8) Verify FilteredImage endpoint on AWS ElasticBeanstalk via Postman tool
9.8.1) FilteredImage endpoint: `http://project02-filter-image-service-dev2.us-east-1.elasticbeanstalk.com/filteredimage`

9.8.2) Verify endpoint via Postman tool
Import collection into Postman tool and test `Project02-Filter-Image-Service\Project02-Filter-Image-Service.postman_collection.json`
[Verify FilteredImage endpoint on Elastic Beanstalk](https://github.com/HungDoan2023/aws-cloud-developer-2023/tree/main/Project02-Filter-Image-Service//images/Verify-FilteredImage-Endpoint-Postman-On-ElasticBeanstalk.png)



### Structure of Filter Image Service Project
[Structure of Filter Image Service Project](https://github.com/HungDoan2023/aws-cloud-developer-2023/tree/main/Project02-Filter-Image-Service/images/structure-of-Filter-Image-Service-project.PNG)


### Many Thanks
1) Thanks the course I have got some AWS technology and how to apply on my working and it's worthy spend time for getting knowledge
2) Thanks trainer & mentor who has contributed on this course
3) Happy AWS technology
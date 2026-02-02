**Edit a file, create a new file, and clone from Bitbucket in under 2 minutes**

When you're done, you can delete the content in this README and update the file with details for others getting started with your repository.

*We recommend that you open this README in another tab as you perform the tasks below. You can [watch our video](https://youtu.be/0ocf7u76WSo) for a full demo of all the steps in this tutorial. Open the video in a new tab to avoid leaving Bitbucket.*

---

## Edit a file

You’ll start by editing this README file to learn how to edit a file in Bitbucket.

1. Click **Source** on the left side.
2. Click the README.md link from the list of files.
3. Click the **Edit** button.
4. Delete the following text: *Delete this line to make a change to the README from Bitbucket.*
5. After making your change, click **Commit** and then **Commit** again in the dialog. The commit page will open and you’ll see the change you just made.
6. Go back to the **Source** page.

---

## Create a file

Next, you’ll add a new file to this repository.

1. Click the **New file** button at the top of the **Source** page.
2. Give the file a filename of **contributors.txt**.
3. Enter your name in the empty file space.
4. Click **Commit** and then **Commit** again in the dialog.
5. Go back to the **Source** page.

Before you move on, go ahead and explore the repository. You've already seen the **Source** page, but check out the **Commits**, **Branches**, and **Settings** pages.

---

## Clone a repository

Use these steps to clone from SourceTree, our client for using the repository command-line free. Cloning allows you to work on your files locally. If you don't yet have SourceTree, [download and install first](https://www.sourcetreeapp.com/). If you prefer to clone from the command line, see [Clone a repository](https://confluence.atlassian.com/x/4whODQ).

1. You’ll see the clone button under the **Source** heading. Click that button.
2. Now click **Check out in SourceTree**. You may need to create a SourceTree account or log in.
3. When you see the **Clone New** dialog in SourceTree, update the destination path and name if you’d like to and then click **Clone**.
4. Open the directory you just created to see your repository’s files.

Now that you're more familiar with your Bitbucket repository, go ahead and add a new file locally. You can [push your change back to Bitbucket with SourceTree](https://confluence.atlassian.com/x/iqyBMg), or you can [add, commit,](https://confluence.atlassian.com/x/8QhODQ) and [push from the command line](https://confluence.atlassian.com/x/NQ0zDQ).

---
## Setting Up the Lombok plugin for IDE Tools:
https://www.baeldung.com/lombok-ide


---
## Setup Serenity with Maven Proj:
http://thucydides.info/docs/serenity-staging/#_building_serenity_projects_in_maven

---
# Run Maven Commands:
Clear the local repository cache and re-install the project:
$mvn dependency:purge-local-repository clean install
---
# Run Test:
1. Run All Test Methods:
$mvn clean test
$mvn clean verify
2. Run Test And Retry Failed Tests:

---
# Generate the aggreate report:
$mvn serenity:aggregate

---
# Sometimes (for example during a CI build process) you may need to check the status of a test run after running it. You can do this using the:
$mvn serenity:check

---
# Generate/Update POJO Class Bases on the xml, xsd file:
1. Pre-condition:
* Make sure the file xsd is generated from xml file using: INtelliJ Tools->XML Action -> Generate XSD from XML
* Move the generated ".xsd" file to the project path "src/main/xsd"
* Modify the element such as: remove "Type" text

2. Run command line:
$mvn jaxb2:xjc
3. After the plugin finishes, the POJOs is placed in POM outputDirectory:
<outputDirectory>${project.build.directory}\generated-sources\jaxb</outputDirectory>


-----
# Run BitBucket Pipeline for Automation Test execution:
**Run the commands below from Powershell on your Windows Host to install the runner. This token will not be displayed again.**
1. download the runner zip
Invoke-WebRequest -Uri https://product-downloads.atlassian.com/software/bitbucket/pipelines/atlassian-bitbucket-pipelines-runner-1.323.zip -OutFile .\atlassian-bitbucket-pipelines-runner.zip

2. unzip the file
Expand-Archive .\atlassian-bitbucket-pipelines-runner.zip

3. launch the runner
cd .\atlassian-bitbucket-pipelines-runner\bin

.\start.ps1 -accountUuid '{8936c14d-7c35-444d-9c6f-726ec603949b}' -repositoryUuid '{6fd1ff3f-44e7-4c4d-a8d6-bb9426a27c4a}' -runnerUuid '{621d7554-ab38-534b-a66c-a413b42b2f4b}' -OAuthClientId 89rQpnx41yryG4mnVoAErADMz5v9Uclz -OAuthClientSecret xjP2RqVNt0gh8tawm6He1Ono92wcCQaQdzdHn77uQX3KH0Ong-MJ2GOdWtpTy361 -workingDirectory '..\temp'

4. Copy the labels and add them to bitbucket-pipelines.yml in the following format. The windows label must be present to run a step on a Windows (64bit) runner. Include the self.hosted label to unlock extended features for your step
Example:

pipelines:
default:
- step:
runs-on:
- self.hosted
- windows
script:
---
# Notes:
1. According to Selenium navigate to URL method, Should use https:// in url to navigate to the site.
2. taskkill /F /IM chromedriver.exe
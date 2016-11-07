node {
  stage: 'Environment Variables'
  sh "env"

  stage: 'Clean'
  sh "rm dist -rf"

  stage 'Checkout Repository'
  git url: 'https://github.com/stackrouteassignments/testJSAssignment.git', branch: "${env.BRANCH_NAME}"

  stage 'Installing Dependencies'
  sh "npm prune"
  sh "npm install"

  stage 'Linting'
  sh "npm run lint"

  stage 'Testing'
  sh "npm test"

  stage 'Build'
  sh "mv htmlhint-output.html output/htmlhint-output.html"
  step([$class: 'ArtifactArchiver', artifacts: 'output/*.html', fingerprint: true])
}

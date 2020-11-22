pipeline {
    agent { docker 'node:6.3' }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh 'cd ./app-vue-3.x'
                sh 'npm install'
            }
        }
    }
}
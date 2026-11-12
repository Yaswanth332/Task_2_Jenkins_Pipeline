
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        pollSCM('H/2 * * * *')
    }

    environment {
        APP_IMAGE = 'task2-nodejs-app'
        APP_CONTAINER = 'task2-nodejs-app'
        APP_PORT = '8081'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                echo 'Building test image and running tests'

                sh 'docker build --target test -t ${APP_IMAGE}:test-${BUILD_NUMBER} .'
            }
        }

        stage('Build Production Image') {
            steps {
                sh 'docker build --target production -t ${APP_IMAGE}:${BUILD_NUMBER} -t ${APP_IMAGE}:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu

                    docker rm -f "$APP_CONTAINER" 2>/dev/null || true

                    docker run -d \
                      --name "$APP_CONTAINER" \
                      --restart unless-stopped \
                      -p "${APP_PORT}:8080" \
                      "${APP_IMAGE}:${BUILD_NUMBER}"
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    set -eu

                    echo "Checking application health..."

                    for attempt in $(seq 1 15); do

                      if curl --fail --silent "http://docker:${APP_PORT}/health"; then
                        echo "Deployment successful"
                        exit 0
                      fi

                      sleep 2

                    done

                    echo "Deployment health check failed"

                    docker logs "$APP_CONTAINER" || true

                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo 'Jenkins CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}

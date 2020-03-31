/* import shared library */
@Library('jenkins-shared-library')_

pipeline {
    agent any
    environment {
        DOCKER_IMAGE_NAME = "cicduser/train-schedule"
        CANARY_REPLICAS = 0
    }
    stages {
        stage('Build') {
            steps {
                echo 'Running build automation'
                sh './gradlew build --no-daemon'
                archiveArtifacts artifacts: 'dist/trainSchedule.zip'
            }
        }
        stage('Build Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    app = docker.build(DOCKER_IMAGE_NAME)
                    app.inside {
                        sh 'echo Hello, World!'
                    }
                }
            }
        }
        stage('Push Docker Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker_hub_login') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }
	stage('CreateFile') {
	    steps {
                script {
    writeFile file: 'groovy1.yml', text: 'kind: Service apiVersion: v1 metadata: name: train-schedule-service namespace: train-ns spec: type: NodePort ports: - port: 8080 targetPort: 8080  nodePort: 31000  selector: app: train-schedule  ---  apiVersion: apps/v1/nkind: Deployment/nmetadata:/nname: train-schedule-deployment/n  namespace: train-ns/n  labels:/n    app: train-schedule/nspec:/n  replicas: 2/n  selector:/n    matchLabels:/n      app: train-schedule/n      track: stable/n  template:/n    metadata:/n      labels:/n        app: train-schedule/n        track: stable/n    spec:/n      containers:/n      - name: train-schedule/nimage: $DOCKER_IMAGE_NAME:$BUILD_NUMBER/n        ports:/n        - containerPort: 8080/n        livenessProbe:/n          httpGet:/n            path: / /n           port: 8080/n          initialDelaySeconds: 15/n          timeoutSeconds: 1/n          periodSeconds: 10/n        resources:/n          requests:/n            cpu: 200m'
    sh 'ls -l groovy1.yml'
    sh 'cat groovy1.yml'
		}
	     }
       }
        
        stage('DeployToProduction') {
            when {
                branch 'master'
            }
            steps {
                milestone(1)
                kubernetesDeploy(
		    kubeconfigId: 'kubeconfig',
                    configs: 'groovy1.yml',
                    enableConfigSubstitution: true
                )
            }
        }
    }
    /*post {
	always {
            kubernetesDeploy (
                kubeconfigId: 'kubeconfig',
                configs: 'train-schedule-kube-canary.yml',
                enableConfigSubstitution: true
            )
        }
	*/    
        //cleanup {
	    
	    /* Use slackNotifier.groovy from shared library and provide current build result as parameter */   
        //    slackNotifier(currentBuild.currentResult)
            // cleanWs()
        //}
   // }
}

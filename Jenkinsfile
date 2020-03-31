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
		def data = "kind: Service\napiVersion: v1\nmetadata:\n  name: ssh\n  namespace: train-ns\nspec:\n  type: NodePort\n  ports:\n    - port: 2022\n      targetPort: 22\n      nodePort: 32222\n  selector:\n    run: ssh\n\n\n---\n\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ssh-deployment\n  namespace: train-ns\n  labels:\n    run: ssh\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      run: ssh\n      track: stable\n  template:\n    metadata:\n      labels:\n        app: train-schedule\n        track: stable\n    spec:\n      containers:\n      - name: ssh\n        image: mauritscasper/ubuntu-ssh:part1\n        ports:\n        - containerPort: 22"
    		writeFile(file: 'groovy1.yml', text: data)
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

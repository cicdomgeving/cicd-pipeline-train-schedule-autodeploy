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
	node {
    writeFile file: 'groovy1.txt', text: 'kind: Service
apiVersion: v1
metadata:
  name: train-schedule-service
  namespace: train-ns
spec:
  type: NodePort
  ports:
    - port: 8080
      targetPort: 8080
      nodePort: 31000
  selector:
    app: train-schedule

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: train-schedule-deployment
  namespace: train-ns
  labels:
    app: train-schedule
spec:
  replicas: 2
  selector:
    matchLabels:
      app: train-schedule
      track: stable
  template:
    metadata:
      labels:
        app: train-schedule
        track: stable
    spec:
      containers:
      - name: train-schedule
        image: $DOCKER_IMAGE_NAME:$BUILD_NUMBER
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /
            port: 8080
          initialDelaySeconds: 15
          timeoutSeconds: 1
          periodSeconds: 10
        resources:
          requests:
            cpu: 200m'
    sh 'ls -l groovy1.txt'
    sh 'cat groovy1.txt'
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

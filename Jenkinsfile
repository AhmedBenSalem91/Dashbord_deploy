pipeline {
    agent any

    environment {
        DOCKER_CLI_EXPERIMENTAL = 'enabled'
        REGISTRY = 'docker.io'
        FRONTEND_IMAGE = 'ahmedbsa/frontend:latest'
        BACKEND_IMAGE = 'ahmedbsa/backend:latest'
        DOCKERHUB_CREDS = credentials('dockerhub-credentials')  // Vos identifiants Docker Hub
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm  // Récupère le code depuis votre dépôt Git
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('front-end') {
                    script {
                        // Construction de l'image Docker pour le front-end
                        sh 'docker build -t $FRONTEND_IMAGE .'
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('back-end') {
                    script {
                        // Construction de l'image Docker pour le back-end
                        sh 'docker build -t $BACKEND_IMAGE .'
                    }
                }
            }
        }

        stage('Scan Vulnerabilities (Frontend)') {
            steps {
                script {
                    // Scan des vulnérabilités pour le front-end avec Trivy
                    sh 'trivy image --exit-code 1 --severity HIGH $FRONTEND_IMAGE'
                }
            }
        }

        stage('Scan Vulnerabilities (Backend)') {
            steps {
                script {
                    // Scan des vulnérabilités pour le back-end avec Trivy
                    sh 'trivy image --exit-code 1 --severity HIGH $BACKEND_IMAGE'
                }
            }
        }

        stage('Push Frontend Image to Docker Hub') {
            steps {
                script {
                    // Connexion à Docker Hub
                    docker.withRegistry("https://$REGISTRY", "$DOCKERHUB_CREDS") {
                        // Pousser l'image front-end sur Docker Hub
                        sh 'docker push $FRONTEND_IMAGE'
                    }
                }
            }
        }

        stage('Push Backend Image to Docker Hub') {
            steps {
                script {
                    // Connexion à Docker Hub
                    docker.withRegistry("https://$REGISTRY", "$DOCKERHUB_CREDS") {
                        // Pousser l'image back-end sur Docker Hub
                        sh 'docker push $BACKEND_IMAGE'
                    }
                }
            }
        }
    }

    post {
        always {
            // Nettoyer les images Docker après la construction et le push
            sh 'docker system prune -f'
        }
        success {
            echo 'Pipeline terminé avec succès!'
        }
        failure {
            echo 'Le pipeline a échoué.'
        }
    }
}

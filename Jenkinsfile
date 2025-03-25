pipeline {
    agent any

    environment {
        DOCKER_BACKEND_IMAGE = "surya2k4/studentverse-backend:latest"
        DOCKER_FRONTEND_IMAGE = "surya2k4/studentverse-frontend:latest"
        BACKEND_CONTAINER_NAME = "studentverse-backend-container"
        FRONTEND_CONTAINER_NAME = "studentverse-frontend-container"
        REGISTRY_CREDENTIALS = "docker"  // Docker Hub credentials ID
        GIT_CREDENTIALS = "demo"         // GitHub credentials ID
        DOCKER_BUILDKIT = "1"            // Enable BuildKit explicitly
    }

    stages {

        stage('Checkout Code') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${GIT_CREDENTIALS}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    git url: "https://${GIT_USER}:${GIT_TOKEN}@github.com/Surya-2k4/StudentVerse.git", branch: 'main'
                }
            }
        }

        stage('Install Buildx (if missing)') {
            steps {
                sh '''
                if ! docker buildx version > /dev/null 2>&1; then
                    echo "Installing Buildx..."
                    docker buildx create --use
                else
                    echo "Buildx already installed."
                fi
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh '''
                    echo "Building Backend Docker Image..."
                    DOCKER_BUILDKIT=1 docker build -t ${DOCKER_BACKEND_IMAGE} ./backend
                    '''
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh '''
                    echo "Building Frontend Docker Image..."
                    DOCKER_BUILDKIT=1 docker build -t ${DOCKER_FRONTEND_IMAGE} ./frontend
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${REGISTRY_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh '''
                    echo "Pushing Backend Image..."
                    docker push ${DOCKER_BACKEND_IMAGE}

                    echo "Pushing Frontend Image..."
                    docker push ${DOCKER_FRONTEND_IMAGE}
                    '''
                }
            }
        }

        stage('Stop & Remove Existing Containers') {
            steps {
                script {
                    sh '''
                    echo "Stopping and removing existing backend container (if running)..."
                    docker rm -f ${BACKEND_CONTAINER_NAME} || true

                    echo "Stopping and removing existing frontend container (if running)..."
                    docker rm -f ${FRONTEND_CONTAINER_NAME} || true
                    '''
                }
            }
        }

        stage('Run Docker Containers') {
            steps {
                script {
                    sh '''
                    echo "Running Backend Container..."
                    docker run -d -p 5000:5000 --name ${BACKEND_CONTAINER_NAME} ${DOCKER_BACKEND_IMAGE}

                    echo "Running Frontend Container..."
                    docker run -d -p 3000:3000 --name ${FRONTEND_CONTAINER_NAME} ${DOCKER_FRONTEND_IMAGE}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful ✅"
        }
        failure {
            echo "Deployment failed ❌"
        }
    }
}

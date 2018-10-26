.PHONY: build run test push scan-image rmi deploy-ecs airbrake

##
# Makefile used to build, test and (locally) run the parliament.uk-prototype project.
##

##
# ENVIRONMENT VARIABLES
#   We use a number of environment  variables to customise the Docker image createad at build time. These are set and
#   detailed below.
##

MSOA_DB_HOST = visual-msoanames.web1devci.org

# App name used to created our Docker image. This name is important in the context of the AWS docker repository.
APP_NAME = parliamentukmsoanames

# AWS account ID used to create our Docker image. This value is important in the context of the AWS docker repository.
# When executed in GoCD, AWS_ACCOUNT_ID may be set by an environment variable
AWS_ACCOUNT_ID ?= $(or $(shell aws sts get-caller-identity --output text --query "Account" 2 > /dev/null), unknown)

# A counter that represents the build number within GoCD. Used to tag and version our images.
GO_PIPELINE_COUNTER ?= unknown



# VERSION is used to tag the Docker images
VERSION = 0.0.$(GO_PIPELINE_COUNTER)

# ECS related variables used to build our image name
# Cluster: list all clusters to update, separated by semicolons
ECS_CLUSTER = ecs-apps
AWS_REGION = eu-west-1



# The name of our Docker image
IMAGE = $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(APP_NAME)



##
# MAKE TASKS
#   Tasks used locally and within our build pipelines to build, test and run our Docker image.
##

GITHUB_API=https://api.github.com
ORG=ukparliament
REPO=visual.parliament.uk-msoanames
LATEST_REL=$(GITHUB_API)/repos/$(ORG)/$(REPO)/releases
REL_TAG=$(shell curl -s $(LATEST_REL) | jq -r '.[0].tag_name')

checkout_to_release:
	git checkout -b release $(REL_TAG)

build: # Using the variables defined above, run `docker build`, tagging the image and passing in the required arguments.
	docker build -t $(IMAGE):$(VERSION) -t $(IMAGE):latest \
		--build-arg MSOA_DB_HOST=$(MSOA_DB_HOST) \
		--build-arg MSOA_DB_PORT=$(MSOA_DB_PORT) \
		--build-arg MSOA_DB_NAME=$(MSOA_DB_NAME) \
		--build-arg MSOA_DB_USERNAME=$(MSOA_DB_USERNAME) \
		--build-arg MSOA_DB_PASSWORD=$(MSOA_DB_PASSWORD) \
		--build-arg MSOA_FLASK_KEY=$(MSOA_FLASK_KEY) \
		.



run: # Run the Docker image we have created, mapping the HOST_PORT and CONTAINER_PORT
	docker run --rm -p $(HOST_PORT):$(CONTAINER_PORT) $(IMAGE)



push: # Push the Docker images we have build to the configured Docker repository (Run in GoCD to push the image to AWS)
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest



rmi: # Remove local versions of our images.
	docker rmi -f $(IMAGE):$(VERSION)
	docker rmi -f $(IMAGE):latest
	docker images -a | grep "^<none>" | awk '{print $3}' | xargs docker rmi || true

deploy-ecs: # Deploy our new Docker image onto an AWS cluster (Run in GoCD to deploy to various environments).
	./aws_ecs/register-task-definition.sh $(APP_NAME)
	./aws_ecs/update-services.sh "$(ECS_CLUSTER)" "$(APP_NAME)" "$(AWS_REGION)"

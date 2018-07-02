package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"secured-til/go-til/db"
	"net/http"
)

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	err := db.Remove(request.PathParameters["id"])
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Can't remove item: " + err.Error(), StatusCode: http.StatusInternalServerError}, nil
	}
	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK}, nil
}

func main() {
	lambda.Start(Handler)
}

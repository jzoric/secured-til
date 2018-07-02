package main

import (
	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"secured-til/go-til/db"
	"net/http"
)

func Handler(event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userId := event.RequestContext.Identity.CognitoIdentityID
	tils, err := db.FindAll(userId)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Can't find tils: " + err.Error(), StatusCode: http.StatusInternalServerError}, nil
	}
	items, _ := json.Marshal(tils)
	return events.APIGatewayProxyResponse{Body: string(items), StatusCode: 200}, nil

}

func main() {
	lambda.Start(Handler)
}

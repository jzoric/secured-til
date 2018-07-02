package main

import (
	"secured-til/go-til/db"
	"net/http"
	"time"

	"encoding/json"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var til db.Til
	err := json.Unmarshal([]byte(request.Body), &til)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Can't process request: " + err.Error(), StatusCode: http.StatusUnprocessableEntity}, nil
	}

	// We know who is creating the request
	til.UserId = request.RequestContext.Identity.CognitoIdentityID
	til.CreatedAt = time.Now()

	err = db.Insert(&til)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Can't save item: " + err.Error(), StatusCode: http.StatusInternalServerError}, nil
	}

	return events.APIGatewayProxyResponse{StatusCode: http.StatusOK}, nil
}

func main() {
	lambda.Start(Handler)
}

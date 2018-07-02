package db

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"log"
	"sort"
	"time"
)

const tableName = "tils"

type Til struct {
	Id          string    `json:"id"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UserId      string    `json:"user_id"`
}

func (t Til) String() string {
	return fmt.Sprintf("TIL=> description: %s", t.Description)
}

type Tils []Til

func (t Tils) Len() int {
	return len(t)
}

func (t Tils) Less(i, j int) bool {
	return t[i].CreatedAt.After(t[j].CreatedAt)
}

func (t Tils) Swap(i, j int) {
	t[i], t[j] = t[j], t[i]
}

// Insert new TIL for a given user
func Insert(item *Til) error {
	s := session.Must(session.NewSession())
	svc := dynamodb.New(s)
	av, err := dynamodbattribute.MarshalMap(item)
	if err != nil {
		log.Println("Got error marshaling map", err)
		return err
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}

	_, err = svc.PutItem(input)
	if err != nil {
		return err
	}
	return nil
}

// Remove TIL by id. Not checking for which user.
func Remove(tilId string) error {
	s := session.Must(session.NewSession())
	svc := dynamodb.New(s)

	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(tilId),
			},
		},
		TableName: aws.String(tableName),
	}

	_, err := svc.DeleteItem(input)
	if err != nil {
		log.Println(err.Error())
		return err
	}
	return nil
}

// Find all tils by given user
func FindAll(userId string) (Tils, error) {
	s := session.Must(session.NewSession())
	svc := dynamodb.New(s)

	var items Tils

	filter := expression.Name("user_id").Equal(expression.Value(userId))

	proj := expression.NamesList(
		expression.Name("description"),
		expression.Name("id"),
		expression.Name("created_at"),
	)

	expr, err := expression.NewBuilder().WithFilter(filter).WithProjection(proj).Build()

	if err != nil {
		log.Println("Error building expression: ", err.Error())
		return items, err
	}

	params := &dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		ProjectionExpression:      expr.Projection(),
		TableName:                 aws.String(tableName),
	}

	result, err := svc.Scan(params)

	if err != nil {
		log.Println("Query API call failed: ", err.Error())
		return items, err
	}

	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &items)
	if err != nil {
		log.Println("DynamoDB got error unmarshalling: ", err.Error())
		return items, err
	}

	sort.Sort(items)

	return items, nil
}

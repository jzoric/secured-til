build:
	dep ensure
	env GOOS=linux go build -ldflags="-s -w" -o bin/insert functions/insert.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/remove functions/remove.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/list functions/list.go

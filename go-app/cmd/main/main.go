package main

import (
	"log"

	"github.com/IgorAryamnov/go-crud/internal/storage"
	"github.com/gin-gonic/gin"
)

func main() {
	db := new(storage.Database)
    var err error
    db.DB, err = storage.ConnectDB()
    if err != nil {
        log.Fatalf("failed connect to DB: %v", err)
		return
    }

	router := gin.Default()
	router.POST("/fields", db.PostFields)
	router.POST("/taskValues", db.GetFields)
	router.GET("/taskValues/:id", db.GetFieldsValueID)
	router.PUT("/fields", db.UpdateFields)
	router.DELETE("/fields", db.DeleteFields)

	router.Run("0.0.0.0:8080")
}
package storage

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type Database struct {
    DB *sql.DB
}

const (
    host     = "db"
    port     = 5432
    user     = "postgres"
    password = "postgres"
    dbname   = "postgres"
)

func ConnectDB() (*sql.DB, error) {
    connString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname = %s sslmode=disable", host, port, user, password, dbname)
    db, err := sql.Open("postgres", connString)
    if err != nil {
        log.Printf("failed to connect to database: %v", err)
        return &sql.DB{}, err
    }
        
    return db, nil
}
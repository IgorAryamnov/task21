package storage

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

type FieldAndTask struct {
    FieldId int `json:"taskStateId"`
    TaskIds []int `json:"tasksIds"`
}
type TaskFieldValue struct {
    TaskId int
    FieldId int
    Value any
}

func (db Database) GetFieldsValueID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        log.Print(err)
        c.IndentedJSON(http.StatusBadRequest, "Bad param")
        return
    }

    q := `SELECT * FROM "TaskFieldValue" WHERE "taskId"=$1;`
    rows, err := db.DB.Query(q, id)
    if err != nil {
        log.Print(err)
		c.IndentedJSON(http.StatusInternalServerError, "")
        return
    }

    defer rows.Close()
    a := make([]TaskFieldValue, 0)
    var rowsReadErr bool
    for rows.Next() {
        var taskId, fieldId int
        var value any
        err = rows.Scan(&taskId, &fieldId, &value)
        if err != nil {
            rowsReadErr = true
            break
        }
        a = append(a, NewTaskFieldValue(taskId, fieldId, value))
    }

    if rowsReadErr {
        log.Println("we are not able to fetch few records")
        c.JSON(http.StatusInternalServerError, "")
    }

    c.JSON(http.StatusOK, a)
}

func (db Database) GetFields(c *gin.Context) {
    var newReq FieldAndTask
    if err := c.BindJSON(&newReq); err != nil {
		c.IndentedJSON(http.StatusBadRequest, "invalid JSON body")
        return
    }

    q := `SELECT * FROM "TaskFieldValue" WHERE "taskId" = any($1);`
    rows, err := db.DB.Query(q, pq.Array(newReq.TaskIds))

    if err != nil {
        log.Print(err)
		c.IndentedJSON(http.StatusInternalServerError, "")
        return
    }
    
    defer rows.Close()
    a := make([]TaskFieldValue, 0)
    var rowsReadErr bool
    for rows.Next() {
        var taskId, fieldId int
        var value any
        err = rows.Scan(&taskId, &fieldId, &value)
        if err != nil {
            rowsReadErr = true
            break
        }
        a = append(a, NewTaskFieldValue(taskId, fieldId, value))
    }

    if rowsReadErr {
        log.Println("we are not able to fetch few records")
        c.JSON(http.StatusInternalServerError, "")
    }

    c.JSON(http.StatusOK, a)
}

func NewTaskFieldValue(taskId, fieldId int, value any) TaskFieldValue {
	return TaskFieldValue{taskId, fieldId, value}
}
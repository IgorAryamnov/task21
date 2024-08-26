package storage

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	_ "github.com/lib/pq"
)
type Field struct {
    FieldType string
    Id int
    Name string
    SelectValues any
}
type Task struct {
    Id int
    Name string
    Description string
    Created string
}

func (db Database) PostFields(c *gin.Context) {
    jsonData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, "bad")
	}

	var res map[string][]any
	json.Unmarshal([]byte(jsonData), &res)
    q := `INSERT INTO public."TaskFieldValue"("taskId","fieldId",value) VALUES`
    vals := []interface{}{}
    var counter = 0
    
	for i := 0; i < len(res["values"]); i++ {
		current := res["values"][i].(map[string]any)
        jsonField, _ := json.Marshal(current["field"])
        jsonTask, _ := json.Marshal(current["task"])

        var structField Field
        var structTask Task
        json.Unmarshal(jsonField, &structField)
        json.Unmarshal(jsonTask, &structTask)
        q += fmt.Sprintf("($%d,$%d,$%d),", counter+1,counter+2,counter+3)
        vals = append(vals, structTask.Id, structField.Id,current["value"])
        counter = counter + 3
    }

    q = q[0:len(q)-1]
    result, err := db.DB.Exec(q, vals...)
    if err != nil {
        log.Print(err)
        c.IndentedJSON(http.StatusInternalServerError, "")
        return
    }

    n, err := result.RowsAffected()
    if err != nil {
        log.Print(err)
        c.IndentedJSON(http.StatusInternalServerError, "")
        return
    }

    if n == 0 {
        log.Print("could not create the record")
        c.IndentedJSON(http.StatusInternalServerError, "")
        return
    }
	c.IndentedJSON(http.StatusOK, "successfully created")
}
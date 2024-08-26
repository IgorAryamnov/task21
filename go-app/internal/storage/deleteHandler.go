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

type DeleteField struct {
    Field int
    Task int
}

func (db Database) DeleteFields(c *gin.Context) {
    jsonData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, "bad")
	}

	var res map[string][]any
	json.Unmarshal([]byte(jsonData), &res)

    q := `DELETE FROM public."TaskFieldValue" WHERE ("taskId","fieldId") IN (`
    vals := []interface{}{}
    var counter = 0
    
	for i := 0; i < len(res["values"]); i++ {
		current := res["values"][i].(map[string]any)
        q += fmt.Sprintf(`($%d,$%d),`, counter+1,counter+2)
        jsonField, _ := json.Marshal(current)
        var structField DeleteField
        json.Unmarshal(jsonField, &structField)
        vals = append(vals, structField.Task, structField.Field)
        counter = counter + 2
    }

    q = q[0:len(q)-1]
    q = q + ")"
    log.Print(vals)
    log.Print(q)

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
        log.Print("could not delete the record, there might be no records for the given ID")
        c.IndentedJSON(http.StatusNotFound, "Bad param")
        return
    }

    c.IndentedJSON(http.StatusOK,"successfully deleted rows")
}
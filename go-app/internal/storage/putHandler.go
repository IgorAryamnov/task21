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

func (db Database) UpdateFields(c *gin.Context) {
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
        vals = append(vals, structTask.Id, structField.Id, current["value"])
        counter = counter + 3
    }

    log.Print(vals)
    
    q = q[0:len(q)-1]
    extraq := ` ON CONFLICT ("taskId","fieldId") DO UPDATE SET value = excluded.value`
    q = q + extraq
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
        log.Print("could not update the record")
        c.IndentedJSON(http.StatusInternalServerError, "")
        return
    }

    c.IndentedJSON(http.StatusOK, "successfully updated rows")
}
package main

import (
	"github.com/haxxorsid/referralboard-private/server/app"
)

func main() {
	// config := config.GetConfig()

	app := &app.App{}
	app.Initialize() //config)
	app.SetUpDB()
	app.Run(":5555")
}

package main

import (
	"github.com/haxxorsid/referralboard/server/app"
	"github.com/haxxorsid/referralboard/server/config"
)

func main() {
	config := config.GetConfig()

	app := &app.App{}
	app.Initialize(config)
	app.SetUpDB()
	app.Run(":5555")
}

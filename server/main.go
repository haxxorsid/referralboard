package main

import (
	"github.com/haxxorsid/referralboard-private/server/app"
	"github.com/haxxorsid/referralboard-private/server/config"
)

func main() {
	config := config.GetConfig()

	app := &app.App{}
	app.Initialize(config)
	app.Run(":5555")
}
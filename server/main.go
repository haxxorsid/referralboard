package main

import (
	"flag"
	"github.com/haxxorsid/referralboard/server/app"
	"github.com/haxxorsid/referralboard/server/config"
)

func main() {
	config := config.GetConfig()
	pgDb := flag.Bool("pgdb", true, "connect to a postgres database")

	app := &app.App{}
	app.Initialize(config, *pgDb)
	app.SetUpDB()
	app.Run(":5555")
}

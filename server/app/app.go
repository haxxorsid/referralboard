package app

import (
	"fmt"
	"log"
	"net/http"
	"github.com/haxxorsid/referralboard-private/server/handler"
	"github.com/haxxorsid/referralboard-private/server/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/gorilla/mux"
)

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

// App initialize with predefined configuration
func (a *App) Initialize(config *config.Config) {
	dbURI := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		config.DB.Host,
		config.DB.User,
		config.DB.Password,
		config.DB.Dbname,
		config.DB.Port,
		config.DB.Sslmode,
		config.DB.TimeZone)

		database, err := gorm.Open(postgres.Open(dbURI), &gorm.Config{})
	
		if err != nil {
			panic("Failed to connect to database!")
		}
	
		a.DB = database
		a.Router = mux.NewRouter()
		a.setRouters()
}

// Set all required routers
func (a *App) setRouters() {
	// Routing for handling the projects
	a.Get("/cards", a.GetAllCards)
	a.Options("/cards", a.HandleOptions)
}

// Wrap the router for GET method
func (a *App) Get(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("GET")
}

// Wrap the router for POST method
func (a *App) Post(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("POST")
}

// Wrap the router for PUT method
func (a *App) Put(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("PUT")
}

// Wrap the router for DELETE method
func (a *App) Delete(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("DELETE")
}

// Wrap the router for DELETE method
func (a *App) Options(path string, f func(w http.ResponseWriter, r *http.Request)) {
	a.Router.HandleFunc(path, f).Methods("OPTIONS")
}

// Handlers to get Posts Data
func (a *App) GetAllCards(w http.ResponseWriter, r *http.Request) {
	handler.GetAllCards(a.DB, w, r)
}

// Handler for options
func (a *App) HandleOptions(w http.ResponseWriter, r *http.Request) {
	handler.RespondJSON(w, http.StatusOK, "all good")
}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}
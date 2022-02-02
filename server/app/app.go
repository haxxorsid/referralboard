package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/haxxorsid/referralboard-private/server/config"
	"github.com/haxxorsid/referralboard-private/server/models"
	"github.com/haxxorsid/referralboard-private/server/services"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

// App initialize with predefined configuration
func (a *App) Initialize(config *config.Config) {
	// fmt.Println(config.DB.Host, config.DB.Password)
	dbURI := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		config.DB.Host,
		config.DB.User,
		config.DB.Password,
		config.DB.Dbname,
		config.DB.Port,
		config.DB.Sslmode,
		config.DB.TimeZone)

	database, err := gorm.Open(postgres.Open(dbURI), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "app.", // schema name
			SingularTable: false,
		}})

	CheckError(err)
	fmt.Println("Connected to db")

	a.DB = database
	a.Router = mux.NewRouter()
	a.setRouters()
}

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

// Set all required routers
func (a *App) setRouters() {
	// Routing for handling the projects

	// Routes for user
	a.Router.HandleFunc("/users", a.GetAllUsers).Methods("GET", "OPTIONS")
	a.Router.HandleFunc("/users/id/{id}", a.GetUserById).Methods("GET", "OPTIONS")
	a.Router.HandleFunc("/users/email/{email}", a.GetUserByEmail).Methods("GET", "OPTIONS")
	a.Router.HandleFunc("/users/newuser", a.AddUser).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/users/{id}", a.UpdateUserById).Methods("PUT", "OPTIONS")

}

// Wrap the GET all Users method
func (a *App) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	services.GetAllUsers(a.DB, w, r)
}

// Wrap the GET  User by Id method
func (a *App) GetUserById(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	CheckError(err)
	user, er := services.GetUserById(a.DB, id)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to fetch user")
		// panic(er)
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Wrap the GET User by email method
func (a *App) GetUserByEmail(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	user, err := services.GetUserByEmail(a.DB, params["email"])
	if err != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to fetch user")
		// panic(er)
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Wrap the POST User method
func (a *App) AddUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	CheckError(err)
	newUser, er := services.AddUser(a.DB, user)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to add user")
		// panic(er)
	} else {
		services.RespondJSON(w, http.StatusOK, newUser)
	}
}

// Wrap the update user method
func (a *App) UpdateUserById(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	CheckError(err)
	userBody := json.NewDecoder(r.Body)
	user, er := services.UpdateUserById(a.DB, w, userBody, id)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to update user")
		// panic(er)
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}

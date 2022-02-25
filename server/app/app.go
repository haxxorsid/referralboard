package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/haxxorsid/referralboard/server/config"
	"github.com/haxxorsid/referralboard/server/models"
	"github.com/haxxorsid/referralboard/server/services"
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
	a.Router = mux.NewRouter().PathPrefix("/api").Subrouter()
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

	// Routes for Posts
	a.Router.HandleFunc("/posts", a.GetAllPosts).Methods("GET", "OPTIONS")
	a.Router.HandleFunc("/posts/newpost", a.AddPost).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/posts/{id}", a.DeletePost).Methods("DELETE", "OPTIONS")

	// Routes for Years of Experience
	a.Router.HandleFunc("/experiences", a.GetAllExperiences).Methods("GET", "OPTIONS")
}

// Wrap the get all post method
func (a *App) GetAllPosts(w http.ResponseWriter, r *http.Request) {
	services.GetAllPosts(a.DB, w, r)
}

// Wrap the add new post method
func (a *App) AddPost(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	err := json.NewDecoder(r.Body).Decode(&post)
	CheckError(err)
	newPost, er := services.AddPost(a.DB, post)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to add post")
	} else {
		services.RespondJSON(w, http.StatusOK, newPost)
	}
}

// Wrap the delete post method
func (a *App) DeletePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	CheckError(err)
	post, er := services.DeletePost(a.DB, id)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error while trying to delete post")
	} else {
		services.RespondJSON(w, http.StatusOK, post)
	}
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
	} else {
		posts, err := services.GetAllPostsByUserId(a.DB, id)
		if err == nil {
			fmt.Println(posts)
		}
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Wrap the GET User by email method
func (a *App) GetUserByEmail(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	user, err := services.GetUserByEmail(a.DB, params["email"])
	if err != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to fetch user")
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Email validation
func isEmailValid(e string) bool {
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRegex.MatchString(e)
}

// Wrap the POST User method
func (a *App) AddUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	// fmt.Println(json.NewDecoder(r.Body))
	err := json.NewDecoder(r.Body).Decode(&user)
	CheckError(err)
	// Check if email is valid
	if !isEmailValid(user.Email) {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to add user - email is not valid")
	} else {
		// Extract company domain from email
		emailParts := strings.Split(user.Email, "@")
		_, domain := emailParts[0], emailParts[1]
		// Get company by domain
		company, er1 := services.GetCompanyByDomain(a.DB, domain)
		// If company exists, overwrite user provided company name with name in the database and set company id
		// If company does not exists, company id remains null and company name remains what user provided
		if er1 == nil {
			user.CurrentCompanyId = company.Id
			user.CurrentCompanyName = company.Name
			user.Verified = true
		}
		// Add user
		newUser, er2 := services.AddUser(a.DB, user)
		if er2 != nil {
			services.RespondError(w, http.StatusBadRequest, er2.Error())
		} else {
			services.RespondJSON(w, http.StatusOK, newUser)
		}
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
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Wrap the GET all Experiences method
func (a *App) GetAllExperiences(w http.ResponseWriter, r *http.Request) {
	services.GetAllExperiences(a.DB, w, r)
}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}

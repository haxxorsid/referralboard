package app

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/mux"
	"github.com/haxxorsid/referralboard/server/config"
	"github.com/haxxorsid/referralboard/server/models"
	"github.com/haxxorsid/referralboard/server/services"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// this should come from ENV or a configuration file
var jwtKey = []byte("referralboard-jwt-token-key")

// App has router and db instances
type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

// Create a struct to read the username and password from the request body
type credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type claims struct {
	UserID int `json:"userId"`
	jwt.StandardClaims
}

// Adapter is an alias so I dont have to type so much.
type Adapter func(http.Handler) http.Handler

// Initialize method initializes with predefined configuration
func (a *App) Initialize(config *config.Config) {
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

	// Route for user login, token validate, and logout
	a.Router.HandleFunc("/login", a.LoginUser).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/logout", a.ValidateLogin(http.HandlerFunc(a.LogoutUser))).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/validatelogin", a.ValidateLogin()).Methods("POST", "OPTIONS")

	// Routes for user
	a.Router.HandleFunc("/users/id", a.ValidateLogin(http.HandlerFunc(a.GetUserById))).Methods("GET", "OPTIONS")
	a.Router.HandleFunc("/users/newuser", a.AddUser).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/users/id/updateprofile", a.ValidateLogin(http.HandlerFunc(a.UpdateUserProfileById))).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/users/id/updateemail", a.ValidateLogin(http.HandlerFunc(a.UpdateUserEmailById))).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/users/id/updatepassword", a.ValidateLogin(http.HandlerFunc(a.UpdateUserPasswordById))).Methods("POST", "OPTIONS")

	// Routes for Posts
	a.Router.HandleFunc("/posts/newpost", a.ValidateLogin(http.HandlerFunc(a.AddPost))).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/posts/id/{id}", a.ValidateLogin(http.HandlerFunc(a.DeletePost))).Methods("POST", "OPTIONS")
	a.Router.HandleFunc("/posts/userid", a.ValidateLogin(http.HandlerFunc(a.GetPostsByUserId))).Methods("GET", "OPTIONS")
	a.Router.HandleFunc("/posts/companyid", a.ValidateLogin(http.HandlerFunc(a.GetPostsByCompanyId))).Methods("GET", "OPTIONS")

	// Routes for Years of Experience
	a.Router.HandleFunc("/experiences", a.GetAllExperiences).Methods("GET", "OPTIONS")

	// Routes for Companies
	a.Router.HandleFunc("/companies", a.ValidateLogin(http.HandlerFunc(a.GetAllCompanies))).Methods("GET", "OPTIONS")
}

// Method to login user by generating JWT Token and setting cookie
func (a *App) LoginUser(w http.ResponseWriter, r *http.Request) {
	var creds credentials
	// Get the JSON body and decode into credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		services.RespondError(w, http.StatusBadRequest, "Structure of the request body is invalid")
		return
	}
	result, err := services.ValidateUserCredentials(a.DB, creds.Email, creds.Password)
	if err != nil || !result {
		services.RespondError(w, http.StatusUnauthorized, "Credentials invalid or some error occured")
		return
	}

	user, err1 := services.GetUserByEmail(a.DB, creds.Email)
	if err1 != nil {
		services.RespondError(w, http.StatusBadRequest, "Some error occured in searching UserId for this email")
		return
	}
	if result {
		// Declare the expiration time of the token
		// here, we have kept it as 5 minutes
		expirationTime := time.Now().Add(30 * time.Minute)
		// Create the JWT claims, which includes the username and expiry time
		claims := &claims{
			UserID: user.ID,
			StandardClaims: jwt.StandardClaims{
				// In JWT, the expiry time is expressed as unix milliseconds
				ExpiresAt: expirationTime.Unix(),
			},
		}

		// Declare the token with the algorithm used for signing, and the claims
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		// Create the JWT string
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			// If there is an error in creating the JWT return an internal server error
			services.RespondError(w, http.StatusInternalServerError, "Some error occured in generating a JWT token")
			return
		}

		// Finally, we set the client cookie for "referralboard-jwt-token" as the JWT we just generated
		// we also set an expiry time which is the same as the token itself
		http.SetCookie(w, &http.Cookie{
			Name:     "referralboard-jwt-token",
			Value:    tokenString,
			Expires:  expirationTime,
			HttpOnly: true,
		})

		services.RespondJSON(w, http.StatusOK, tokenString)
	}
}

// ValidateLogin is the middleware.
func (a *App) ValidateLogin(next ...http.Handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// We can obtain the session token from the requests cookies, which come with every request
		c, err := r.Cookie("referralboard-jwt-token")
		if err != nil {
			if err == http.ErrNoCookie {
				// If the cookie is not set, return an unauthorized status
				services.RespondError(w, http.StatusUnauthorized, "No cookie in cookies found")
				return
			}
			// For any other type of error, return a bad request status
			services.RespondError(w, http.StatusBadRequest, "Some error occured in getting token from cookie")
			return
		}

		// Get the JWT string from the cookie
		tknStr := c.Value

		// Initialize a new instance of `Claims`
		claims := &claims{}

		// Parse the JWT string and store the result in `claims`.
		// Note that we are passing the key in this method as well. This method will return an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				services.RespondError(w, http.StatusUnauthorized, "Invalid signature in token cookie")
				return
			}
			services.RespondError(w, http.StatusBadRequest, "Some error occured while verifying token cookie signature")
			return
		}
		if !tkn.Valid {
			services.RespondError(w, http.StatusUnauthorized, "The token is not valid")
			return
		}
		if len(next) == 1 {
			next[0].ServeHTTP(w, r)
		} else {
			services.RespondJSON(w, http.StatusOK, tknStr)
		}
	}
}

func getTokenBody(r *http.Request) *claims {
	c, _ := r.Cookie("referralboard-jwt-token")
	tknStr := c.Value
	claims := &claims{}
	jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	return claims
}

func (a *App) LogoutUser(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	expirationTime := time.Now()
	claims.ExpiresAt = expirationTime.Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		services.RespondError(w, http.StatusInternalServerError, "Some error occured while signing the token for 0 expiration time")
		return
	}

	// Set the new token as the users `token` cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "referralboard-jwt-token",
		Value:   tokenString,
		Expires: expirationTime,
	})
	services.RespondJSON(w, http.StatusOK, "Logged out the user")
}

// Wrap the add new post method
func (a *App) AddPost(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	var post models.Post
	err := json.NewDecoder(r.Body).Decode(&post)
	CheckError(err)
	post.UserID = claims.UserID
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

// Wrap the GET  User by Id method
func (a *App) GetUserById(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	user, er := services.GetUserById(a.DB, claims.UserID)
	if er != nil {
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
			user.CompanyID = company.ID
			user.CompanyName = company.Name
			verified := true
			user.Verified = &verified
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
func (a *App) UpdateUserProfileById(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	requestBody := json.NewDecoder(r.Body)
	user, er := services.UpdateUserProfileById(a.DB, w, requestBody, claims.UserID)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to update user profile by id")
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Wrap the update user method
func (a *App) UpdateUserEmailById(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	requestBody := json.NewDecoder(r.Body)
	user, er := services.UpdateUserEmailById(a.DB, w, requestBody, claims.UserID)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to update user email by id")
	} else {
		services.RespondJSON(w, http.StatusOK, user)
	}
}

// Wrap the update user method
func (a *App) UpdateUserPasswordById(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	var userPassword models.UserPassword
	// Get the JSON body and decode into credentials
	err := json.NewDecoder(r.Body).Decode(&userPassword)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		services.RespondError(w, http.StatusBadRequest, "Structure of the request body is invalid")
		return
	}
	user, er1 := services.GetUserById(a.DB, claims.UserID)
	if er1 != nil {
		// If the structure of the body is wrong, return an HTTP error
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to update user password by id")
		return
	}
	result, err := services.ValidateUserCredentials(a.DB, user.Email, userPassword.CurrentPassword)
	if err != nil || !result {
		services.RespondError(w, http.StatusUnauthorized, "Credentials invalid or some error occured")
		return
	}
	updatedUser, er := services.UpdateUserPasswordById(a.DB, w, claims.UserID, userPassword.NewPassword)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to update user password by id")
	} else {
		services.RespondJSON(w, http.StatusOK, updatedUser)
	}
}

// Wrap the GET all Experiences method
func (a *App) GetAllExperiences(w http.ResponseWriter, r *http.Request) {
	services.GetAllExperiences(a.DB, w, r)
}

// Wrap the GET all Companies method
func (a *App) GetAllCompanies(w http.ResponseWriter, r *http.Request) {
	services.GetAllCompanies(a.DB, w, r)
}

// Wrap the GET User posts by user Id method
func (a *App) GetPostsByUserId(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	posts, er := services.GetPostsByUserId(a.DB, claims.UserID)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to fetch posts of a user")
	} else {
		services.RespondJSON(w, http.StatusOK, posts)
	}
}

// Wrap the GET User posts by company id
func (a *App) GetPostsByCompanyId(w http.ResponseWriter, r *http.Request) {
	claims := getTokenBody(r)
	user, er := services.GetUserById(a.DB, claims.UserID)
	if er != nil {
		services.RespondError(w, http.StatusBadRequest, "Error occured while trying to fetch a user")
	} else {
		posts := []models.Post{}
		if user.CompanyID == 0 {
			services.RespondJSON(w, http.StatusOK, posts)
		} else {
			posts, er = services.GetPostsByCompanyId(a.DB, user.CompanyID)
			if er != nil {
				services.RespondError(w, http.StatusBadRequest, "Error occured while trying to fetch posts by user's company")
			} else {
				services.RespondJSON(w, http.StatusOK, posts)
			}
		}
	}
}

// Run the app on it's router
func (a *App) Run(host string) {
	log.Fatal(http.ListenAndServe(host, a.Router))
}

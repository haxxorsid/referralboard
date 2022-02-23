package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gopkg.in/go-playground/validator.v9"
	"gorm.io/gorm"
)

func validateUser(user models.User) error {
	v := validator.New()
	err := v.Struct(user)
	return err
}

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

// Fetch all users
func GetAllUsers(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	users := []models.User{}
	db.Find(&users)
	RespondJSON(w, http.StatusOK, users)
}

// Fetch User based on Email id
func GetUserByEmail(db *gorm.DB, email string) (models.User, error) {
	var user models.User
	err := db.Where(&models.User{Email: email}).First(&user).Error
	return user, err
}

// Fetch User based on User Id
func GetUserById(db *gorm.DB, id int) (models.User, error) {
	var user models.User
	err := db.Where(&models.User{Id: id}).Preload("Posts").First(&user).Error
	return user, err
}

// Add a user
func AddUser(db *gorm.DB, user models.User) (models.User, error) {
	e := validateUser(user)
	if e != nil {
		return models.User{}, e
	}
	err := db.Create(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return GetUserByEmail(db, user.Email)
}

// Update user by Id
func UpdateUserById(db *gorm.DB, w http.ResponseWriter, userBody *json.Decoder, id int) (models.User, error) {
	var user models.User
	userBody.Decode(&user)

	err := db.Where(&models.User{Id: id}).Updates(models.User{FirstName: user.FirstName, LastName: user.LastName, Email: user.Email, Password: user.Password, CurrentLocation: user.CurrentLocation, CurrentCompanyId: user.CurrentCompanyId, CurrentCompanyName: user.CurrentCompanyName, CurrentPosition: user.CurrentPosition, YearsOfExperienceId: user.YearsOfExperienceId, School: user.School}).Error
	if err != nil {
		return user, err
	}

	return GetUserByEmail(db, user.Email)
}

// Fetch all the Post of a User
func GetAllPostsByUserId(db *gorm.DB, id int) ([]models.Post, error) {
	var posts []models.Post
	currentUser, err := GetUserById(db, id)
	if err == nil {
		fmt.Println("NO ERROR!!!")
		posts = currentUser.Posts
		return posts, err
	} else {
		fmt.Println(err)
	}
	return posts, err
}

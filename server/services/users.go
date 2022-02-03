package services

import (
	"encoding/json"
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

// Fetch ass users
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
	err := db.Where(&models.User{Id: id}).First(&user).Error
	return user, err
}

// Add a user
func AddUser(db *gorm.DB, user models.User) (models.User, error) {
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

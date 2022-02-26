package services

import (
	"encoding/json"
	"net/http"
	"strings"
	"errors"
	"github.com/haxxorsid/referralboard/server/models"
	"gopkg.in/go-playground/validator.v9"
	"gorm.io/gorm"
	"golang.org/x/crypto/bcrypt"
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
	err := db.Where(&models.User{Id: id}).First(&user).Error
	return user, err
}

// Fetch User and its posts based on User Id
func GetUserWithPostsByUserId(db *gorm.DB, id int) (models.User, error) {
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
	
	password := []byte(user.Password)

    // Hashing the password with the default cost of 10
    hashedPassword, er := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if er != nil {
		return models.User{}, er
	}

    user.Password = string(hashedPassword)

	err := db.Create(&user).Error
	if err != nil {
		return models.User{}, err
	}
	return GetUserByEmail(db, user.Email)
}

// Update user profile by Id
func UpdateUserProfileById(db *gorm.DB, w http.ResponseWriter, requestBody *json.Decoder, id int) (models.User, error) {
	var userProfile models.UserProfile
	err := requestBody.Decode(&userProfile)
	CheckError(err)
	currentUser, err := GetUserById(db, id)
	if err != nil {
		return models.User{}, err
	}
	verified := *currentUser.Verified
	if currentUser.CurrentCompanyId == 0{
		verified = false
	} else {
		company, e := GetCompanyById(db, currentUser.CurrentCompanyId)
		if e != nil {
			return models.User{}, e
		}
		if company.Name == userProfile.CurrentCompanyName {
			verified = true
		} else {
			verified = false
		}
	}
	er := db.Where(&models.User{Id: id}).Updates(models.User{FirstName: userProfile.FirstName, LastName: userProfile.LastName, CurrentLocation: userProfile.CurrentLocation, CurrentCompanyName: userProfile.CurrentCompanyName, CurrentPosition: userProfile.CurrentPosition, YearsOfExperienceId: userProfile.YearsOfExperienceId, School: userProfile.School, Verified: &verified}).Error
	if er != nil {
		return models.User{}, er
	}

	return GetUserById(db, id)
}

// Fetch all the Post of a User
func GetAllPostsByUserId(db *gorm.DB, id int) ([]models.Post, error) {
	var posts []models.Post
	currentUser, err := GetUserById(db, id)
	if err == nil {
		posts = currentUser.Posts
		return posts, nil
	} 
	return posts, err
}

// Check if password is valid for a particular email
func ValidateUserCredentials(db *gorm.DB, email string, password string) (bool, error) {
	passwordByte := []byte(password)
	user, e := GetUserByEmail(db, email)
	if e == nil {
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), passwordByte)
		if err == nil {
			return true, nil
		}
		return false, err
	}
	return false, e
}

// Update user email by Id
func UpdateUserEmailById(db *gorm.DB, w http.ResponseWriter, requestBody *json.Decoder, id int) (models.User, error) {
	var userEmail models.UserEmail
	err := requestBody.Decode(&userEmail)
	CheckError(err)
	currentUser, err := GetUserById(db, id)
	if err != nil {
		return models.User{}, err
	}
	 // Extract company domain from email
	 emailParts := strings.Split(userEmail.Email, "@")
	 _, domain := emailParts[0], emailParts[1]
	 // Get company by domain
	 company, er1 := GetCompanyByDomain(db, domain)
	 currentCompanyId := currentUser.CurrentCompanyId
	 currentCompanyName := currentUser.CurrentCompanyName
	 verified := *currentUser.Verified
	 // If company exists, overwrite user provided company name with name in the database and set company id
	 // If company does not exists, company id remains null and company name remains what user provided
	 var er error
	 if er1 == nil {
		 currentCompanyId = company.Id
		 currentCompanyName = company.Name
		 verified = true
		 er = db.Where(&models.User{Id: id}).Updates(models.User{Email: userEmail.Email, CurrentCompanyName: currentCompanyName, CurrentCompanyId: currentCompanyId, Verified: &verified}).Error
	 } else if errors.Is(er1, gorm.ErrRecordNotFound) {
		verified = false
		// fix this case to set currentcompanyid as nil
		er = db.Where(&models.User{Id: id}).Updates(models.User{Email: userEmail.Email, CurrentCompanyId: -1, CurrentCompanyName: currentCompanyName, Verified: &verified}).Error
	 }
	if er != nil {
		return models.User{}, er
	}
	return GetUserById(db, id)
}

// Update user password by Id
func UpdateUserPasswordById(db *gorm.DB, w http.ResponseWriter, id int, newPassword string) (models.User, error) {
	password := []byte(newPassword)
    // Hashing the password with the default cost of 10
    hashedPassword, er := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	finalPassword := string(hashedPassword)
	er = db.Where(&models.User{Id: id}).Updates(models.User{Password: finalPassword}).Error
	if er != nil {
		return models.User{}, er
	}
	return GetUserById(db, id)
}
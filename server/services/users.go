package services

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/haxxorsid/referralboard/server/models"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/go-playground/validator.v9"
	"gorm.io/gorm"
)

func validateUser(user models.User) error {
	v := validator.New()
	err := v.Struct(user)
	return err
}

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

// GetUserByEmail fetches a user based on Email
func GetUserByEmail(db *gorm.DB, email string) (models.User, error) {
	var user models.User
	err := db.Where(&models.User{Email: email}).First(&user).Error
	return user, err
}

// GetUserByID fetches a User based on UserID
func GetUserByID(db *gorm.DB, id int) (models.User, error) {
	var user models.User
	err := db.Where(&models.User{ID: id}).First(&user).Error
	return user, err
}

// AddUser creates a user
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

// UpdateUserProfileByID updates a user profile by UserID
func UpdateUserProfileByID(db *gorm.DB, w http.ResponseWriter, requestBody *json.Decoder, id int) (models.User, error) {
	var userProfile models.UserProfile
	err := requestBody.Decode(&userProfile)
	checkError(err)
	currentUser, err := GetUserByID(db, id)
	if err != nil {
		return models.User{}, err
	}
	verified := *currentUser.Verified
	if currentUser.CompanyID == 0 {
		verified = false
	} else {
		company, e := GetCompanyByID(db, currentUser.CompanyID)
		if e != nil {
			return models.User{}, e
		}
		if company.Name == userProfile.CompanyName {
			verified = true
		} else {
			verified = false
		}
	}
	er := db.Where(&models.User{ID: id}).Updates(models.User{FirstName: userProfile.FirstName, LastName: userProfile.LastName, Location: userProfile.Location, CompanyName: userProfile.CompanyName, Position: userProfile.Position, YearsOfExperienceID: userProfile.YearsOfExperienceId, School: userProfile.School, Verified: &verified}).Error
	if er != nil {
		return models.User{}, er
	}

	return GetUserByID(db, id)
}

// ValidateUserCredentials checks if password is valid for a particular email
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

// UpdateUserEmailByID updates an user email by UserID
func UpdateUserEmailByID(db *gorm.DB, w http.ResponseWriter, requestBody *json.Decoder, id int) (models.User, error) {
	var userEmail models.UserEmail
	err := requestBody.Decode(&userEmail)
	checkError(err)
	currentUser, err := GetUserByID(db, id)
	if err != nil {
		return models.User{}, err
	}
	// Extract company domain from email
	emailParts := strings.Split(userEmail.Email, "@")
	_, domain := emailParts[0], emailParts[1]
	// Get company by domain
	company, er1 := GetCompanyByDomain(db, domain)
	var companyID int
	CompanyName := currentUser.CompanyName
	verified := *currentUser.Verified
	// If company exists, overwrite user provided company name with name in the database and set company id
	// If company does not exists, company id remains null and company name remains what user provided
	var er error
	if er1 == nil {
		companyID = company.ID
		CompanyName = company.Name
		verified = true
		er = db.Where(&models.User{ID: id}).Updates(models.User{Email: userEmail.Email, CompanyName: CompanyName, CompanyID: companyID, Verified: &verified}).Error
	} else if errors.Is(er1, gorm.ErrRecordNotFound) {
		verified = false
		// fix this case to set companyID as nil
		er = db.Where(&models.User{ID: id}).Updates(models.User{Email: userEmail.Email, CompanyID: 0, CompanyName: CompanyName, Verified: &verified}).Error
	}
	if er != nil {
		return models.User{}, er
	}
	return GetUserByID(db, id)
}

// UpdateUserPasswordByID updates user password by UserID
func UpdateUserPasswordByID(db *gorm.DB, w http.ResponseWriter, id int, newPassword string) (models.User, error) {
	password := []byte(newPassword)
	// Hashing the password with the default cost of 10
	hashedPassword, er := bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
	if er != nil {
		return models.User{}, er
	}
	finalPassword := string(hashedPassword)
	er = db.Where(&models.User{ID: id}).Updates(models.User{Password: finalPassword}).Error
	if er != nil {
		return models.User{}, er
	}
	return GetUserByID(db, id)
}

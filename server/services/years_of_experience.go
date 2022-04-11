package services

import (
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

// GetAllExperiences fetches all experiences
func GetAllExperiences(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	experiences := []models.YearsOfExperience{}
	db.Find(&experiences)
	RespondJSON(w, http.StatusOK, experiences)
}

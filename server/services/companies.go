package services

import (
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

func GetAllCompanies(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	company := []models.Company{}
	db.Find(&company)
	RespondJSON(w, http.StatusOK, company)
}

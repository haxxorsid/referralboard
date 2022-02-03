package services

import (
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

func GetAllPosts(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	posts := []models.Post{}
	db.Find(&posts)
	RespondJSON(w, http.StatusOK, posts)
}

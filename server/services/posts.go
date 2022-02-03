package services

import (
	"net/http"

	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

// Get all post
func GetAllPosts(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	posts := []models.Post{}
	db.Find(&posts)
	RespondJSON(w, http.StatusOK, posts)
}

// Fetch Post based on Post Id
func GetPostById(db *gorm.DB, id int) (models.Post, error) {
	var post models.Post
	err := db.Where(&models.Post{Id: id}).First(&post).Error
	return post, err
}

// Add a post
func AddPost(db *gorm.DB, post models.Post) (models.Post, error) {
	err := db.Create(&post).Error
	if err != nil {
		return models.Post{}, err
	}
	return GetPostById(db, int(post.Id))
}

// Delete post by id
func DeletePost(db *gorm.DB, id int) (models.Post, error) {
	var post models.Post
	post, err := GetPostById(db, id)
	if err == nil {
		er := db.Delete(&post).Error
		if er != nil {
			return post, er
		}
	}
	return post, err
}
package services

import (
	"github.com/haxxorsid/referralboard/server/models"
	"gorm.io/gorm"
)

// GetPostByID fetches Post based on Post Id
func GetPostByID(db *gorm.DB, id int) (models.Post, error) {
	var post models.Post
	err := db.Where(&models.Post{ID: id}).First(&post).Error
	return post, err
}

// AddPost creates a post
func AddPost(db *gorm.DB, post models.Post) (models.Post, error) {
	err := db.Create(&post).Error
	if err != nil {
		return models.Post{}, err
	}
	return GetPostByID(db, int(post.ID))
}

// DeletePost deletes a post by id
func DeletePost(db *gorm.DB, id int) (models.Post, error) {
	var post models.Post
	post, err := GetPostByID(db, id)
	if err == nil {
		er := db.Delete(&post).Error
		if er != nil {
			return post, er
		}
	}
	return post, err
}

// GetPostsByUserID fetches posts based on UserId
func GetPostsByUserID(db *gorm.DB, userID int) ([]models.Post, error) {
	var posts []models.Post
	err := db.Where(&models.Post{UserID: userID}).Preload("Company").Order("created_at desc").Find(&posts).Error
	return posts, err
}

// GetPostsByCompanyID fetches posts based on CompanyId
func GetPostsByCompanyID(db *gorm.DB, companyID int) ([]models.Post, error) {
	var posts []models.Post
	err := db.Where(&models.Post{CompanyID: companyID}).Preload("Company").Preload("User").Preload("User.YearsOfExperience").Order("created_at desc").Find(&posts).Error
	return posts, err
}

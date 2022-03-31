package services

import (
	"github.com/haxxorsid/referralboard-private/server/models"
	"gorm.io/gorm"
)

// Fetch Post based on Post Id
func GetPostById(db *gorm.DB, id int) (models.Post, error) {
	var post models.Post
	err := db.Where(&models.Post{ID: id}).First(&post).Error
	return post, err
}

// Add a post
func AddPost(db *gorm.DB, post models.Post) (models.Post, error) {
	err := db.Create(&post).Error
	if err != nil {
		return models.Post{}, err
	}
	return GetPostById(db, int(post.ID))
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

// Fetch posts based on UserId
func GetPostsByUserId(db *gorm.DB, userId int) ([]models.Post, error) {
	var posts []models.Post
	err := db.Where(&models.Post{UserID: userId}).Preload("Company").Order("created_at desc").Find(&posts).Error
	return posts, err
}

// Fetch posts based on CompanyId
func GetPostsByCompanyId(db *gorm.DB, companyId int) ([]models.Post, error) {
	var posts []models.Post
	err := db.Where(&models.Post{CompanyID: companyId}).Preload("Company").Preload("User").Preload("User.YearsOfExperience").Order("created_at desc").Find(&posts).Error
	return posts, err
}

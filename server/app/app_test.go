package app

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"net/http"
	"net/http/httptest"

	"github.com/haxxorsid/referralboard-private/server/models"
)

var a = &App{}

func TestMain(m *testing.M) {
	// config := config.GetConfig()
	a.Initialize() //config)
	a.SetUpDB()
	code := m.Run()
	os.Exit(code)
}

func executeRequest(req *http.Request) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	a.Router.ServeHTTP(rr, req)
	return rr
}

func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}

var sessionToken string

// =========== LOG In =============
// unit test for user login with invalid credentials
func TestUserLoginWrongCredentials(t *testing.T) {
	cred := credentials{
		"mailaddress23@companya.com",
		"root",
	}
	loginformValues, _ := json.Marshal(cred)

	// fmt.Println("credentials: ", cred)

	req, err := http.NewRequest("POST", "/api/login", bytes.NewBuffer(loginformValues))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
	// fmt.Println("response received for loging: ", response.Body)
}

// unit test for user login with valid credentials
func TestUserLogin(t *testing.T) {
	cred := credentials{
		"mailaddress2@companya.com",
		"root",
	}
	loginformValues, _ := json.Marshal(cred)

	req, err := http.NewRequest("POST", "/api/login", bytes.NewBuffer(loginformValues))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
	sessionToken = response.Header().Get("Set-Cookie")
}

// unit test for getUser by Id
func TestGetUserById(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/users/id", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", sessionToken)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
	// validate details for dummy user
	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)

	currentCompanyName := m["currentCompanyName"].(string)

	if currentCompanyName != "Company A" {
		t.Errorf("Expected the 'error' key of the response to be set to 'User not found'. Got '%s'", m["error"])
	}
}

// ===========    Update User    ===========
// unit test for update user profile
func TestUpdateUserProfileById(t *testing.T) {
	updateForm := &models.UserProfile{
		FirstName:           "updated_firstName",
		LastName:            "updated_lastname",
		Location:            "Florida",
		CompanyName:         "Company C",
		Position:            "Software Engineer",
		School:              "University of Florida",
		YearsOfExperienceId: 2,
	}

	userformValue, _ := json.Marshal(updateForm)

	req, err := http.NewRequest("POST", "/api/users/id/updateprofile", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", sessionToken)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	// fmt.Println("Response received: ", response.Body)
	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)
	firstName := m["firstName"].(string)

	if firstName != "updated_firstName" {
		t.Errorf("Expected firstname to be updated_firstName. Got '%v'", m["firstName"])
	}
}

// unit test for update user profile with invalid session
func TestUpdateUserProfileByIdWithInvalidSession(t *testing.T) {
	updateForm := &models.UserProfile{
		FirstName:           "updated_firstName",
		LastName:            "updated_lastname",
		Location:            "Florida",
		CompanyName:         "Company C",
		Position:            "Software Engineer",
		School:              "University of Florida",
		YearsOfExperienceId: 2,
	}

	userformValue, _ := json.Marshal(updateForm)

	req, err := http.NewRequest("POST", "/api/users/id/updateprofile", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", "wrongSessionToken")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// unit test for checking if update email is working for user with session
func TestUpdateUserEmailById(t *testing.T) {
	userEmail := &models.UserEmail{
		Email: "mailaddress11@companya.com",
	}

	userformValue, _ := json.Marshal(userEmail)

	req, err := http.NewRequest("POST", "/api/users/id/updateemail", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", sessionToken)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

}

// unit test for checking if update email is working for user with invalid session
func TestUpdateUserEmailByIdWithInvalidSession(t *testing.T) {
	userEmail := &models.UserEmail{
		Email: "mailaddress11@companya.com",
	}

	userformValue, _ := json.Marshal(userEmail)

	req, err := http.NewRequest("POST", "/api/users/id/updateemail", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", "wrongSessionToken")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)

}

// unit test for updating the user password with valid session
func TestUpdateUserPasswordById(t *testing.T) {
	userPassword := &models.UserPassword{
		CurrentPassword: "root",
		NewPassword:     "toor",
	}

	userformValue, _ := json.Marshal(userPassword)

	req, err := http.NewRequest("POST", "/api/users/id/updatepassword", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", sessionToken)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
}

// unit test for updating the user password with invalid session
func TestUpdateUserPasswordByIdWithInvalidSession(t *testing.T) {
	userPassword := &models.UserPassword{
		CurrentPassword: "root",
		NewPassword:     "toor",
	}

	userformValue, _ := json.Marshal(userPassword)

	req, err := http.NewRequest("POST", "/api/users/id/updatepassword", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", "invalidSessionToken")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// ================     POSTS    ==================
// unit test for fetching all the post of a user with valid session
func TestGetPostsByUserId(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/posts/userid", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", sessionToken)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var m []map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)

	if len(m) < 1 {
		t.Error("Post retrieval failed")
	}
	_, ok := m[0]["postId"]
	if !ok {
		t.Error("Post id is missing")
	}

}

// unit test to add Notes for a user with valid session
func TestAddPost(t *testing.T) {
	post := &models.Post{
		UserID:    3,
		CompanyID: 1,
		Position:  "Product Manager",
		Message:   "Message 3",
		Resume:    "Resume 3",
		JobLink:   "https://www.companya.com/jobid/abc123",
	}

	userformValue, _ := json.Marshal(post)

	req, err := http.NewRequest("POST", "/api/posts/newpost", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", sessionToken)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
}

// unit test to add Notes for a user with invalid session
func TestAddPostWithInvalidSession(t *testing.T) {
	post := &models.Post{
		UserID:    3,
		CompanyID: 1,
		Position:  "Product Manager",
		Message:   "Message 3",
		Resume:    "Resume 3",
		JobLink:   "https://www.companya.com/jobid/abc123",
	}

	userformValue, _ := json.Marshal(post)

	req, err := http.NewRequest("POST", "/api/posts/newpost", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", "invalidSessionToken")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// unit test for checking delete post feature
func TestDeletePostWithInvalidSession(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/posts/id/1", nil)
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", "invalidSessionToken")
	// req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// unit test for checking delete post feature
func TestDeletePost(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/posts/id/1", nil)
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", sessionToken)
	// req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
}

// unit test to fetch GetPostsByCompanyId with valid session
func TestGetPostsByCompanyId(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/posts/companyid", nil)
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", sessionToken)
	// req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var m []map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)
	fmt.Println("Number of posts: ", len(m))
	if len(m) != 1 {
		t.Errorf("Fetch post by user's company id failed")
	}
}

// unit test to fetch GetPostsByCompanyId with invalid session
func TestGetPostsByCompanyIdWithInvalidSession(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/posts/companyid", nil)
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Cookie", "invalidSessionToken")
	// req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// ========= Session Validation ===========
// unit test for user session validation with valid session token
func TestValidLogin(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/validatelogin", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", sessionToken)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
}

// unit test for user session validation with invalid session token
func TestValidLoginInValidSession(t *testing.T) {
	var invalidSessionToken = "referralboard-jwt-token=wrongSessionToken"
	req, err := http.NewRequest("POST", "/api/validatelogin", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", invalidSessionToken)
	response := executeRequest(req)
	checkResponseCode(t, http.StatusBadRequest, response.Code)
}

// unit test for user session validation without session token
func TestValidLoginNoSessionToken(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/validatelogin", nil)
	if err != nil {
		t.Fatal(err)
	}
	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// =========== LOGOUT ============

// unit test for user logout with valid session token
func TestUserLogout(t *testing.T) {
	// var sessionToken = "referralboard-jwt-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTY0OTc5NzQyMn0.i5TkQ8DiHDKXWJzsy6EH13JhFRoIOXekul6YrJFpoCU; Expires=Tue, 12 Apr 2022 21:03:42 GMT; HttpOnly"
	req, err := http.NewRequest("POST", "/api/logout", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", sessionToken)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)
}

// unit test case for get user with invalid session
func TestGetUserByIdWithInvalidSession(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/users/id", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", "invalidSessionToken")
	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// unit test for user logout with invalid session token
func TestUserLogoutWithInvalidSession(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/logout", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Add("Cookie", "invalidSessionToken")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusUnauthorized, response.Code)
}

// ============ Add User ==============

// unit test for adding new user
func TestAddUser(t *testing.T) {

	testUsers := &models.User{
		FirstName:           "Mallikaaa",
		LastName:            "Kumar",
		Location:            "Mumbai",
		CompanyName:         "Company ABCD",
		Position:            "Software Engineer",
		School:              "University of Mumbai",
		YearsOfExperienceID: 1,
		Email:               "mailaddress4@asd.com",
		Password:            "root",
	}
	userformValue, _ := json.Marshal(testUsers)

	req, err := http.NewRequest("POST", "/api/users/newuser", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)

	if m["lastName"] != "Kumar" {
		t.Errorf("Expected the 'error' key of the response to be set to 'User not found'. Got '%s'", m["error"])
	}
}

// invalid email
func TestInvalidEmail(t *testing.T) {
	testUsers := &models.User{
		FirstName:           "Dummy_FN",
		LastName:            "Dummy_LN",
		Location:            "Mumbai",
		CompanyName:         "Company ABCD",
		Position:            "Software Engineer",
		School:              "University of Mumbai",
		YearsOfExperienceID: 1,
		Email:               "mailaddress4",
		Password:            "root",
	}
	userformValue, _ := json.Marshal(testUsers)

	req, err := http.NewRequest("POST", "/api/users/newuser", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusBadRequest, response.Code)
}

// email is comapanyA -- success if companyId == 1
func TestUserRegistrationWithExistingCompany(t *testing.T) {
	testUsers := &models.User{
		FirstName:           "Dummy_FirstName",
		LastName:            "Dummy_LastName",
		Location:            "Dummy_Location",
		CompanyName:         "Company A",
		Position:            "Software Engineer",
		School:              "University of Mumbai",
		YearsOfExperienceID: 1,
		Email:               "mailaddress2a@companya.com",
		Password:            "root",
	}
	userformValue, _ := json.Marshal(testUsers)

	req, err := http.NewRequest("POST", "/api/users/newuser", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)

	// fmt.Println("response: ", m)
	num := m["currentCompanyId"].(float64)
	// fmt.Println("currentCompanyId: ", num)
	// fmt.Println("type: ", reflect.ValueOf(m["[CompanyID"]).Kind(), ", value recieved: ", m["[CompanyID"])
	if num != float64(1) {
		t.Errorf("Expected company ID expected to be <nil>. Got '%v'", m["CompanyId"])
	}
}

// email is comapanyRandom -- success if companyId == null
func TestUserRegistrationWithRandomCompany(t *testing.T) {
	testUsers := &models.User{
		FirstName:           "Mallikaaa",
		LastName:            "Kumar",
		Location:            "Mumbai",
		CompanyName:         "Company ABCD",
		Position:            "Software Engineer",
		School:              "University of Mumbai",
		YearsOfExperienceID: 1,
		Email:               "mailaddress2a@asd.com",
		Password:            "root",
	}
	userformValue, _ := json.Marshal(testUsers)

	req, err := http.NewRequest("POST", "/api/users/newuser", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)
	num := m["currentCompanyId"].(float64)

	if num != float64(0) {
		t.Errorf("Expected comapny ID to be 0. Got '%v'", m["CompanyId"])
	}
}

// not unique email format
func TestNotUniqueEmail(t *testing.T) {
	testUsers := &models.User{
		FirstName:           "Mallikaaa",
		LastName:            "Kumar",
		Location:            "Mumbai",
		CompanyName:         "Company A",
		Position:            "Software Engineer",
		School:              "University of Mumbai",
		YearsOfExperienceID: 1,
		Email:               "mailaddress1@companyb.com",
		Password:            "root",
	}
	userformValue, _ := json.Marshal(testUsers)

	req, err := http.NewRequest("POST", "/api/users/newuser", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusBadRequest, response.Code)
}

// check company name is in sync with company table -- success if companyName != provided company anem
func TestUserRegistrationWithExistingCompanyName(t *testing.T) {
	testUsers := &models.User{
		FirstName:           "Mallikaaa",
		LastName:            "Kumar",
		Location:            "Mumbai",
		CompanyName:         "Company A",
		Position:            "Software Engineer",
		School:              "University of Mumbai",
		YearsOfExperienceID: 1,
		Email:               "mailaddress2ab@companya.com",
		Password:            "root",
	}
	userformValue, _ := json.Marshal(testUsers)

	req, err := http.NewRequest("POST", "/api/users/newuser", bytes.NewBuffer(userformValue))
	if err != nil {
		t.Fatal(err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	response := executeRequest(req)
	checkResponseCode(t, http.StatusOK, response.Code)

	var m map[string]interface{}
	json.Unmarshal(response.Body.Bytes(), &m)
	companyName := m["currentCompanyName"].(string)

	if companyName != "Company A" {
		t.Errorf("Expected comapny ID to be 0. Got '%v'", m["CompanyId"])
	}
}

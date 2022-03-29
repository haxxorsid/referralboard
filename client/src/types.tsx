export type companyType = {
    companyId: number,
    name: string,
    domain: string
}

export type postType = {
    postId: number,
    userId: number,
    targetCompanyId: number,
    targetPosition: string,
    message: string,
    resume: string,
    jobLink: string,
    createdAt: string,
    company: companyType
}

export type experienceType = {
    yearsOfExperienceId: number,
    description: string
}

export type registerFormType = {
    firstName: string,
    lastName: string,
    currentLocation: string,
    currentCompanyName: string,
    currentPosition: string,
    school: string,
    yearsOfExperienceId: number,
    email: string,
    password: string
}

export type loginType = {
    email: string,
    password: string
}

export type profileFormType = {
    firstName: string,
    lastName: string,
    currentLocation: string,
    currentCompanyName: string,
    currentPosition: string,
    school: string,
    yearsOfExperienceId: number
}

export type emailFormType = {
    email: string
}

export type passwordFormType = {
    currentPassword: string,
    newPassword: string
}

export type cardProps = {
    self: boolean,
    displayToast: (severity: string, message: string) => void,
    post: postType,
    deletePost: (postId: number) => void
}

export type userType = {
    userId: number,
    firstName: string,
    lastName: string,
    currentLocation: string,
    currentCompanyId: number,
    currentCompanyName: string,
    currentPosition: string,
    school: string,
    yearsOfExperienceId: number,
    email: string,
    password: string,
    verified: boolean
}

export type createPostFormType = {
    targetCompanyId: number; 
    targetPosition: string; 
    message: string; 
    resume: string; 
    jobLink: string;
}

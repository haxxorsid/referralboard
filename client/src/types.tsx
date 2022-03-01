export type postType = {
    postId: number,
    userId: number,
    targetCompanyId: number,
    targetPosition: string,
    message: string,
    resume: string,
    jobLink: string,
    createdAt: string
}

export type experienceType = {
    yearsOfExperienceId: number,
    description: string
}

export type userType = {
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
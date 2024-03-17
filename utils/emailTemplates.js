export const welcomeTemplate = (username) => { 
    const message = `Hii ${username},\n
Welcome to SkillMingle, the platform where talents meet opportunities ! We are thrilled to have you join our community of skilled individuals and innovative thinkers.At SkillMingle, we believe in the power of collaboration and the endless possibilities that arise when diverse talents come together. Whether you are looking to showcase your skills, connect with like-minded professionals, or explore new opportunities, SkillMingle is here to support you at every step of the way.\n
Here are a few ways you can get started and make the most out of your SkillMingle experience:\n
-> Complete Your Profile: Take some time to fill out your profile with information about your skills, skills you want to learn, skills you want to teach,experiences and interests. A complete profile helps us to recommed you matching users and others to discover and connect with you more easily.\n
-> Explore Communities: Join communities relevant to your interests and expertise. Engage in discussions, share insights, and network with people who share your passions.\n
-> Connect and Share: Reach out to other members, connect with potential peoples having the skill you desire, and start meaningful conversations. You never know where these connections may lead!\n
-> Stay Updated: Keep an eye on your notifications and emails for updates on new skill exchanges, messages from other members, and important platform announcements.\n\n
If you ever need assistance or have any questions, our support team is here to help. Feel free to reach out to us at <teamfusion.ait@gmail.com>.\n
Once again, welcome to SkillMingle! We can't wait to see the amazing things you accomplish and the connections you make on our platform.

Best regards,
SkillMingle Team`

    return message;
}

export const forgotPasswordTemplate = (username, resetURL) => {
    const message = `Hii ${username},\n
Forgot your Password !? Don't worry just use the following link for resetting your password.\n
Password Reset URL : ${resetURL}\n
If this action is not initiated by you, then just ignore this email.\n

Best regards,
SkillMingle Team`

    return message;
}
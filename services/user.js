"use strict";

module.exports = class User {
    constructor(igsid) {
        this.igsid = igsid;
        this.name = "";
        this.profilePic = "";
    }
    setProfile(profile) {
        this.name = profile.name;
        this.profilePic = profile.profilePic;
    }
};

export default class CommunicationController {
    static BASE_URL = "https://ewserver.di.unimi.it/mobicomp/treest/"

    static async treestRequest(endpoint, parameters) {
        //console.log("sending request to: " + endpoint);
        const url = this.BASE_URL + endpoint;
        let httpResponse = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        });
        const status = httpResponse.status;
        //console.log(status)
        if (status == 200) {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } else {
            let error = new Error("Error message from the server. HTTP status: " + status);
            throw error;
        }
    }

    static async register() {
        const endPoint = "register.php";
        const parameter = {};
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async getLines(sid) {
        const endPoint = "getLines.php";
        const parameter = { sid: sid };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async getPosts(sid, did) {
        const endPoint = "getPosts.php";
        const parameter = { sid: sid, did: did };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async addPost(sid, did, delay, status, comment) {
        const endPoint = "addPost.php";
        const parameter = { sid: sid, did: did, delay: delay, status: status, comment: comment };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async getUserPicture(sid, uid) {
        const endPoint = "getUserPicture.php";
        const parameter = { sid: sid, uid: uid };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async getProfile(sid) {
        const endPoint = "getProfile.php";
        const parameter = { sid: sid };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async follow(sid, uid) {
        const endPoint = "follow.php";
        const parameter = { sid: sid, uid: uid };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async unfollow(sid, uid) {
        const endPoint = "unfollow.php";
        const parameter = { sid: sid, uid: uid };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async getStations(sid, did) {
        const endPoint = "getStations.php";
        const parameter = { sid: sid, did: did };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }

    static async setProfile(sid, name, picture) {
        const endPoint = "setProfile.php";
        const parameter = { sid: sid, name: name, picture: picture };
        return await CommunicationController.treestRequest(endPoint, parameter);
    }
}
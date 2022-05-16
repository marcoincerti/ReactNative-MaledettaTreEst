export default class CommunicationController {
    static BASE_URL = "https://ewserver.di.unimi.it/mobicomp/treest/"

    static async genericRequest(endpoint, parameters) {
        console.log("sending request to: " + endpoint);
        const url = this.BASE_URL + endpoint + ".php";
        let httpResponse = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parameters)
        });

        const status = httpResponse.status;
        if (status == 200) {
            let deserializedObject = await httpResponse.json(); 
            return deserializedObject;  
        }
        else
        {
            let error = new Error("Error message from the server. HTTP status: " + status); 
            throw error;
        }
    }

    static async register() {
        const endPoint = "register";  
        const parameter = {};       
        return await CommunicationController.genericRequest(endPoint, parameter);  
    } 

    static async getLines(sid) {
        const endPoint = "getLines";    
        const parameter = {sid: sid};      
        return await CommunicationController.genericRequest(endPoint, parameter); 
    }

    static async getPosts(sid, did) {
        const endPoint = "getPosts";    
        const parameter = {sid: sid, did: did};      
        return await CommunicationController.genericRequest(endPoint, parameter); 
    }

    static async getProfile(sid) {
        const endPoint = "getProfile";    
        const parameter = {sid: sid};      
        return await CommunicationController.genericRequest(endPoint, parameter); 
    }

    static async setProfile(sid, name, picture) {
        const endPoint = "setProfile";    
        const parameter = {sid: sid, name: name, picture: picture};      
        return await CommunicationController.genericRequest(endPoint, parameter); 
    }

    static async addPost(sid, did, delay, status, comment){
        const endPoint = "addPost"
        let parameter = {sid: sid, did: did}
        if(delay != -1)
            parameter.delay = delay
        if(status != -1)
            parameter.status = status
        if(comment != "")
            parameter.comment = comment
        return await CommunicationController.genericRequest(endPoint, parameter);
    }

    static async getUserPicture(sid, uid){
        console.log("Prendo la foto di " + uid);
        const endPoint = "getUserPicture"
        const parameter = {sid: sid, uid: uid}
        return await CommunicationController.genericRequest(endPoint, parameter);
    }

    static async getStations(sid, did){
        console.log("Prendo la stazioni di " + did);
        const endPoint = "getStations"
        const parameter = {sid: sid, did: did}
        return await CommunicationController.genericRequest(endPoint, parameter);
    }
    
    static async follow(sid, uid){
        console.log("Faccio il follow " + uid);
        const endPoint = "follow"
        const parameter = {sid: sid, uid: uid}
        return await CommunicationController.genericRequest(endPoint, parameter);
    }

    static async unfollow(sid, uid){
        console.log("Faccio l'unfollow " + uid);
        const endPoint = "unfollow"
        const parameter = {sid: sid, uid: uid}
        return await CommunicationController.genericRequest(endPoint, parameter);
    }

}
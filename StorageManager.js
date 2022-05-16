import * as SQLite from 'expo-sqlite';

export default class StorageManager {
    constructor(){
        this.db = SQLite.openDatabase("myDB")
    }

    initDB(onResult, onError){
        const transaction = (tx) => {
            let query = "CREATE TABLE User (\
                userid int,\
                pversion int,\
                picture varchar(100000));";
            tx.executeSql(query, [],
                (tx, queryResult) => {
                    onResult(queryResult)
                }),
                (tx, error) => {
                    onError(error)
                }
        }
        const error = (e) => {onError(e)}
        this.db.transaction(transaction, error);
    }

    getUserPicture(userid, pversion, onResult, onError){
        const transaction = (tx) => {
            let query = "SELECT picture FROM User WHERE userid = ? AND pversion = ?";
            tx.executeSql(query, [userid, pversion],
                (tx, queryResult) => {
                    onResult(queryResult)
                }),
                (tx, error) => {
                    onError(error)
                }
        }
        const error = (e) => {onError(e)}
        this.db.transaction(transaction, error);
    }


    // funziona sia come prima Insert che come Update (visto che prima di tutto cancella le tuple coinvolte)
    storeUserPicture(userid, pversion, picture, onResult, onError){
        // console.log(userid + " " + pversion + " " + picture)
        const transaction = (tx) => {
            let queryDelete = "DELETE FROM User WHERE userid = ?;"
            let queryInsert = "INSERT INTO User VALUES (?, ?, ?)";
            tx.executeSql(queryDelete, [userid],
                (tx, firstQueryResult) => {
                    tx.executeSql(queryInsert, [userid, pversion, picture],
                        (tx, queryResult) => onResult(queryResult),
                        (tx,error) => onError(error)) 
                }),
                (tx, error) => {
                    onError(error)
                }
        }
        const error = (e) => {onError(e)}
        this.db.transaction(transaction, error);
    }



}
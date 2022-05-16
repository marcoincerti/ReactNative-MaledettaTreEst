import React, { Component } from 'react';
import { Button, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CommunicationController from '../CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyContext } from '../context.js';
import StorageManager from '../StorageManager';


const Separator = () => (
    <View style={styles.separator} />
  );

const delay_values = ["In Orario", "Di pochi minuti", "Oltre 15 minuti", "Treni Soppressi"]
const status_values = ["Situazione ideale", "Accettabile", "Gravi problemi per i passeggeri"]


class Post extends React.Component {
    static contextType = MyContext

    state = {
        pic:null,
        placeholderPic:'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'
    }
    
    componentDidMount(){
        this.retrieveUserPic()
    }

    componentDidUpdate(pastProps){
        // se la versione della pic è cambiata nei nuovi post (anche me stesso, quando ritorno dalla pagina profilo)
        if(pastProps.data.item.pversion != this.props.data.item.pversion){
            console.log("nuova user pic!")
            this.retrieveUserPic()
        }
    }

    retrieveUserPic(){
        const sid = this.context.sid
        const post = this.props.data.item
        if(post.pversion > 0){
                console.log("Voglio la picture di " + post.author)
                let sm = new StorageManager();
                // richiedo la pic con la pversion del post (la più nuova)
                sm.getUserPicture(post.author, post.pversion,
                    result => {
                        if(result.rows.length > 0) {
                            console.log("Ho la pic aggiornata!")
                            this.state.pic = result.rows._array[0].picture;
                            this.setState(this.state)
                        } 
                        else {
                            console.log("non ho la pic aggiornata")
                            CommunicationController.getUserPicture(sid, post.author)
                            .then(unmarshelledObject => {
                                sm.storeUserPicture(unmarshelledObject.uid, unmarshelledObject.pversion, unmarshelledObject.picture,
                                    result => {console.log("Pic di " + unmarshelledObject.uid + " aggiornata")},
                                    error => {console.log(error)})
                                this.state.pic = unmarshelledObject.picture
                                this.setState(this.state)
                            })
                            .catch(error => console.log("ERRORE " + error))
                        }
                    },
                    error => {console.log(error)})
        }
    }

    render() { 
        const post = this.props.data.item
        const uid = this.context.uid
        return <View style={styles.postStyle}>
            <Separator/>
                <View style={[styles.rowStyle, styles.firstRow]}>
                    <Image style={styles.img} source={{uri:'data:image/png;base64,' + ((this.state.pic!=null && this.isValidBase64(this.state.pic)) ? this.state.pic : this.state.placeholderPic)}}/>
                    <Text style={styles.authorName}>{post.author == uid ? "Tu" : post.authorName}</Text>
                    {post.author != uid ?
                        <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.followBtn , post.followingAuthor ? styles.unfollowBtn : null]}
                        onPress={() => this.handleFollowUser(post.author, post.followingAuthor)}>
                            <Text style={styles.followBtnText}>{post.followingAuthor ? "Non Seguire" : "Segui"}</Text>
                        </TouchableOpacity>
                    : <TouchableOpacity></TouchableOpacity>
                    }
                </View>
                <View style={styles.rowStyle}>
                    <Text style={styles.leftItem}>Ritardo</Text>
                    <Text style={styles.rightItem}>Stato</Text>
                </View>
                <View style={styles.rowStyle}>
                    <Text style={[styles.importantInfo, styles.leftItem, post.followingAuthor ? styles.infoFollowPost : null]}>{delay_values[post.delay] != undefined ? delay_values[post.delay] : "-"}</Text>
                    <Text style={[styles.importantInfo, styles.rightItem, post.followingAuthor ? styles.infoFollowPost : null]}>{status_values[post.status] != undefined ? status_values[post.status] : "-"}</Text>
                </View>
                <Separator/>
                <Text>Commento</Text>
                <Text style={[styles.importantInfo, post.followingAuthor ? styles.infoFollowPost : null]}>{post.comment != undefined ? post.comment : "-"}</Text>
                <Separator/>
                {/* tolgo i millisecondi */}
                <Text>{post.datetime.replace(post.datetime.substr(post.datetime.indexOf('.'), post.datetime.length), "")}</Text> 
            <Separator/>
        </View>;
    }

    isValidBase64(text){
        let knownTypes = {
            '/': 'data:image/jpg;base64,',
            'i': 'data:image/png;base64,',
        }
        if(!knownTypes[text[0]]){
            console.log("encoded image didn't match known types");
            return false;
        }else{
            var base64regex = /[A-Za-z0-9+/]/;
            return base64regex.test(text)
        }
    }

    handleFollowUser = (uid, alreadyFollow) => {
        const sid = this.context.sid
        if(alreadyFollow)
            CommunicationController.unfollow(sid, uid).then(unmarshalledObject => this.props.refreshBoard())
        else
            CommunicationController.follow(sid, uid).then(unmarshalledObject => this.props.refreshBoard())
    }

}

const styles = StyleSheet.create({
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      img: {
        width: 50,
        height: 50,
    },
    postStyle:{
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
          width: 1.2,
          height: 1.2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 0,
        margin: 10,
    },
    rowStyle:{
        marginTop: 7,
        paddingLeft: 15,
        paddingRight: 15,
        width: "100%",
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    authorName:{
        fontWeight: 'bold',
        fontSize: 17,
        color: '#333E63',
    },
    importantInfo:{
        color: '#333E63',
        fontSize: 15,
        fontWeight: '700',
        maxWidth: "90%",
        textAlign: 'center'
    },
    leftItem:{
        textAlign: 'left',
        marginLeft: "11%",
        maxWidth: "35%", //override di importantInfo

    },
    rightItem:{
        textAlign: 'right',
        marginRight: "11%",
        maxWidth: "40%", //override di importantInfo
    },
    firstRow:{
        alignItems: 'center'
    },
    followBtn:{
        padding: 8,
        margin: 4,
        justifyContent: 'center',
        borderWidth: 1,
        elevation: 1,
        backgroundColor: '#fff',
        borderRadius: 30,
    },
    followBtnText:{
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.2
    },
    unfollowBtn:{
        backgroundColor: '#F8A059',
        borderColor: '#F8A059'
    },
    infoFollowPost:{
        color: '#F8A059',
        fontWeight: '700'
    }
  });
 
export default Post;
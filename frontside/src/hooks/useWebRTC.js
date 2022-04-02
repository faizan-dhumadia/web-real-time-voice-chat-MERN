import { useState, useRef, useEffect, useCallback } from "react"
import { useStateWithCallBack } from "./useStateWithCallBack"
import { socketInit } from "../socket"
import { ACTION } from "../action";
import freeice from 'freeice'

// const users = [{
//         id: 1,
//         name: 'Faizan'
//     },
//     {
//         id: 2,
//         name: "jondo",
//     }
// ]
export const useWebRTC = (roomId, user) => {
    const [client, setClient] = useStateWithCallBack([]);
    const audioElements = useRef({});
    const connection = useRef({});
    const localMediaStream = useRef(null);
    const socket = useRef(null)
    const clientRef = useRef([])

    useEffect(() => {
        socket.current = socketInit();
    }, [])


    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    }

    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = client.find((client) => client.id === newClient.id)
            if (lookingFor === undefined) {
                setClient((existingClient) => [...existingClient, newClient], cb)
            }
        }, [client, setClient],
    )


    //capture media
    useEffect(() => {
        const startCapture = async() => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
        }


        startCapture().then(() => {
            addNewClient({...user, muted: true }, () => {
                    const localElement = audioElements.current[user.id];
                    if (localElement) {
                        localElement.volume = 0;
                        localElement.srcObject = localMediaStream.current
                    }

                })
                //socket emit JOIN socket io
            socket.current.emit(ACTION.JOIN, { roomId, user })
        })
        return () => {
            localMediaStream.current.getTracks().forEach((track) => track.stop());
            socket.current.emit(ACTION.LEAVE, { roomId })
        }
    }, [])


    //Handle New Peer
    useEffect(() => {
        const handleNewPeer = async({ peerId, createOffer, user: remoteUser }) => {
                //if already connected
                if (peerId in connection.current) {
                    return console.warn(`You are already connected with ${peerId} (${user.name})`);
                }
                //store it to connection
                connection.current[peerId] = new RTCPeerConnection({
                        iceServers: freeice()
                    })
                    //hendle new ice candideate
                connection.current[peerId].onicecandidate = (event) => {
                    socket.current.emit(ACTION.RELAY_ICE, {
                        peerId,
                        icecandidate: event.candidate
                    })
                }

                //Handle on track ont heis connection
                connection.current[peerId].ontrack = ({
                    streams: [
                        remoteStream
                    ]
                }) => {
                    addNewClient({...remoteUser, muted: true }, () => {
                        if (audioElements.current[remoteUser.id]) {
                            audioElements.current[remoteUser.id].srcObject = remoteStream
                        } else {
                            let settled = false;
                            const interval = setInterval(() => {
                                if (audioElements.current[remoteUser.id]) {
                                    audioElements.current[remoteUser.id].srcObject = remoteStream
                                    settled = true;
                                }
                                if (settled) {
                                    clearInterval(interval)
                                }
                            }, 1000);
                        }
                    });
                }

                //add local tract to remote connection
                localMediaStream.current.getTracks().forEach((track) => {
                    connection.current[peerId].addTrack(track, localMediaStream.current)
                });

                //create offer
                if (createOffer) {
                    const offer = await connection.current[peerId].createOffer()

                    //set the local descripton
                    await connection.current[peerId].setLocalDescription(offer)
                        //send offer to another
                    socket.current.emit(ACTION.RELAY_SDP, {
                        peerId,
                        sessionDescription: offer
                    })
                }
            }
            // Listen for add peer event from ws
        socket.current.on(ACTION.ADD_PEER, handleNewPeer)

        return () => {
            socket.current.off(ACTION.ADD_PEER)
        }
    }, [client])


    //handle ice candidate
    useEffect(() => {
        socket.current.on(ACTION.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                connection.current[peerId].addIceCandidate(icecandidate)
            }
        })

        return () => {
            socket.current.off(ACTION.ICE_CANDIDATE)
        }
    }, [])


    //Handle SDP
    useEffect(() => {
        const setRemoteMedia = async({ peerId, sessionDescription: remoteSessionDescription }) => {
            connection.current[peerId].setRemoteDescription(
                    new RTCSessionDescription(remoteSessionDescription)
                )
                //if SD is type of offer then create an answer
            if (remoteSessionDescription.type === 'offer') {
                const ctn = connection.current[peerId];
                const answer = await ctn.createAnswer();
                ctn.setLocalDescription(answer);

                socket.current.emit(ACTION.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer
                })
            }
        }
        socket.current.on(ACTION.SESSION_DESCRIPTION, setRemoteMedia)
        return () => {
            socket.current.off(ACTION.SESSION_DESCRIPTION)
        }
    }, [])


    useEffect(() => {
        window.addEventListener('unload', function() {
            alert('leaving');
            socket.current.emit(ACTION.LEAVE, { roomId })
        })


    }, [])

    //handle remove peer
    useEffect(() => {
        const handleRemovePeer = ({ peerId, userId }) => {
            console.log('leaving', peerId, userId);
            if (connection.current[peerId]) {
                connection.current[peerId].close();
            }
            delete connection.current[peerId];
            delete audioElements.current[peerId];

            setClient((list) => list.filter((c) => c.id !== userId))
        }
        socket.current.on(ACTION.REMOVE_PEER, handleRemovePeer)

        return () => {
            socket.current.off(ACTION.REMOVE_PEER)
        };
    }, [])

    useEffect(() => {
        clientRef.current = client
    }, [client])



    //listen for mute unmute
    useEffect(() => {
        socket.current.on(ACTION.MUTE, ({ peerId, userId }) => {
            setMute(true, userId)
        })
        socket.current.on(ACTION.UNMUTE, ({ peerId, userId }) => {
            setMute(false, userId)
        })
        const setMute = (mute, userId) => {
            const clientIdx = clientRef.current.map((client) => client.id).indexOf(userId);
            console.log("idx", clientIdx);
            const connectedClients = JSON.parse(JSON.stringify(clientRef.current));
            if (clientIdx > -1) {
                connectedClients[clientIdx].muted = mute;
                setClient(connectedClients)
            }
        }
    }, [])



    //handle mute
    const handleMute = (isMute, userId) => {
        let settled = false
        if (userId === user.id) {

            let interval = setInterval(() => {
                if (localMediaStream.current) {

                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if (isMute) {
                        socket.current.emit(ACTION.MUTE, {
                            roomId,
                            userId: user.id,
                        })
                    } else {
                        socket.current.emit(ACTION.UNMUTE, { roomId, userId: user.id })
                    }
                    settled = true
                }

                if (settled) {
                    clearInterval(interval)
                }
            }, 200);
        }
    }


    return { client, provideRef, handleMute }
}
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
// import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, addDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// // Your Firebase config
// const firebaseConfig = {
//     apiKey: "AIzaSyAkQj5xIqIN91tGXvevIwV3MzPf0y_vIss",
//     authDomain: "myfirstvideocall-6f561.firebaseapp.com",
//     projectId: "myfirstvideocall-6f561",
//     storageBucket: "myfirstvideocall-6f561.firebasestorage.app",
//     messagingSenderId: "818858628392",
//     appId: "1:818858628392:web:3825718cdb5b0b054fac1d",
//     measurementId: "G-8NV237Y9VW"
// };

// const app = initializeApp(firebaseConfig); 
// const firestore = getFirestore(app);

// const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// let pc;
// let localStream;
// let remoteStream;

// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");

// const startCallBtn = document.getElementById("startCallBtn");
// const joinCallBtn = document.getElementById("joinCallBtn");
// const roomIdInput = document.getElementById("roomIdInput");
// const hangupBtn = document.getElementById("hangupBtn");

// let roomRef;
// let callerCandidatesCollection;
// let calleeCandidatesCollection;

// startCallBtn.onclick = async () => {
//     pc = new RTCPeerConnection(servers);

//     localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     remoteStream = new MediaStream();

//     localVideo.srcObject = localStream;
//     remoteVideo.srcObject = remoteStream;

//     localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

//     roomRef = doc(collection(firestore, "rooms")); // create new room doc with auto id

//     callerCandidatesCollection = collection(roomRef, "callerCandidates");
//     calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

//     pc.onicecandidate = async event => {
//         if (event.candidate) {
//             await addDoc(callerCandidatesCollection, event.candidate.toJSON());
//         }
//     };

//     pc.ontrack = event => {
//         event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
//     };

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     const roomWithOffer = {
//         offer: {
//             type: offer.type,
//             sdp: offer.sdp,
//         }
//     };

//     await setDoc(roomRef, roomWithOffer);

//     // Listen for remote answer
//     onSnapshot(roomRef, async snapshot => {
//         const data = snapshot.data();
//         if (!pc.currentRemoteDescription && data?.answer) {
//             const answerDesc = new RTCSessionDescription(data.answer);
//             await pc.setRemoteDescription(answerDesc);
//         }
//     });

//     // Listen for callee ICE candidates
//     onSnapshot(calleeCandidatesCollection, snapshot => {
//         snapshot.docChanges().forEach(change => {
//             if (change.type === "added") {
//                 const candidate = new RTCIceCandidate(change.doc.data());
//                 pc.addIceCandidate(candidate);
//             }
//         });
//     });

//     console.log(`Room created! Share this ID:\n${roomRef.id}`);
// };

// joinCallBtn.onclick = async () => {
//     const roomId = roomIdInput.value;
//     if (!roomId) {
//         alert("Please enter a Room ID");
//         return;
//     }

//     roomRef = doc(firestore, "rooms", roomId);
//     callerCandidatesCollection = collection(roomRef, "callerCandidates");
//     calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

//     pc = new RTCPeerConnection(servers);

//     localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     remoteStream = new MediaStream();

//     localVideo.srcObject = localStream;
//     remoteVideo.srcObject = remoteStream;

//     localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

//     pc.ontrack = event => {
//         event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
//     };

//     pc.onicecandidate = async event => {
//         if (event.candidate) {
//             await addDoc(calleeCandidatesCollection, event.candidate.toJSON());
//         }
//     };

//     const roomSnapshot = await getDoc(roomRef);
//     if (!roomSnapshot.exists()) {
//         alert("Room does not exist!");
//         return;
//     }

//     const roomData = roomSnapshot.data();
//     const offerDescription = roomData.offer;
//     await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);

//     await updateDoc(roomRef, { answer: { type: answer.type, sdp: answer.sdp } });

//     // Listen for caller ICE candidates
//     onSnapshot(callerCandidatesCollection, snapshot => {
//         snapshot.docChanges().forEach(change => {
//             if (change.type === "added") {
//                 const candidate = new RTCIceCandidate(change.doc.data());
//                 pc.addIceCandidate(candidate);
//             }
//         });
//     });
// };

// hangupBtn.onclick = async () => {
//     if (pc) pc.close();
//     if (localStream) localStream.getTracks().forEach(track => track.stop());
//     if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());

//     if (roomRef) {
//         const calleeCandidatesSnapshot = await getDocs(collection(roomRef, "calleeCandidates"));
//         calleeCandidatesSnapshot.forEach(async doc => await deleteDoc(doc.ref));
//         const callerCandidatesSnapshot = await getDocs(collection(roomRef, "callerCandidates"));
//         callerCandidatesSnapshot.forEach(async doc => await deleteDoc(doc.ref));
//         await deleteDoc(roomRef);
//     }

//     localVideo.srcObject = null;
//     remoteVideo.srcObject = null;

//     alert("Call ended and room deleted");
// };


// ✅ Firebase + WebRTC video call with proper remote stream handling
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
    getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot,
    addDoc, deleteDoc, getDocs
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAkQj5xIqIN91tGXvevIwV3MzPf0y_vIss",
    authDomain: "myfirstvideocall-6f561.firebaseapp.com",
    projectId: "myfirstvideocall-6f561",
    storageBucket: "myfirstvideocall-6f561.firebasestorage.app",
    messagingSenderId: "818858628392",
    appId: "1:818858628392:web:3825718cdb5b0b054fac1d",
    measurementId: "G-8NV237Y9VW"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

let pc;
let localStream;
let remoteStream;

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const startCallBtn = document.getElementById("startCallBtn");
const joinCallBtn = document.getElementById("joinCallBtn");
const roomIdInput = document.getElementById("roomIdInput");
const hangupBtn = document.getElementById("hangupBtn");

let roomRef;
let callerCandidatesCollection;
let calleeCandidatesCollection;

startCallBtn.onclick = async () => {
    pc = new RTCPeerConnection(servers);

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
        console.log("📥 Caller received remote track");
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    };

    pc.onicecandidate = async (event) => {
        if (event.candidate) {
            console.log("📤 Caller ICE candidate:", event.candidate);
            await addDoc(callerCandidatesCollection, event.candidate.toJSON());
        }
    };

    roomRef = doc(collection(firestore, "rooms"));
    callerCandidatesCollection = collection(roomRef, "callerCandidates");
    calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await setDoc(roomRef, {
        offer: {
            type: offer.type,
            sdp: offer.sdp,
        },
    });

    onSnapshot(roomRef, async snapshot => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
            console.log("📥 Caller got answer");
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    });

    onSnapshot(calleeCandidatesCollection, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const candidate = new RTCIceCandidate(change.doc.data());
                console.log("📥 Caller got callee ICE");
                pc.addIceCandidate(candidate);
            }
        });
    });

    console.log(`Room created! Share this ID: ${roomRef.id}`);
    alert(`Room created! Share this ID: ${roomRef.id}`);
};

joinCallBtn.onclick = async () => {
    const roomId = roomIdInput.value;
    if (!roomId) return alert("Please enter a Room ID");

    roomRef = doc(firestore, "rooms", roomId);
    callerCandidatesCollection = collection(roomRef, "callerCandidates");
    calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    const roomSnapshot = await getDoc(roomRef);
    if (!roomSnapshot.exists()) return alert("Room not found!");

    pc = new RTCPeerConnection(servers);

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;

    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
        console.log("📥 Callee received remote track");
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    };

    pc.onicecandidate = async (event) => {
        if (event.candidate) {
            console.log("📤 Callee ICE candidate:", event.candidate);
            await addDoc(calleeCandidatesCollection, event.candidate.toJSON());
        }
    };

    const offer = roomSnapshot.data().offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await updateDoc(roomRef, {
        answer: {
            type: answer.type,
            sdp: answer.sdp,
        },
    });

    onSnapshot(callerCandidatesCollection, snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const candidate = new RTCIceCandidate(change.doc.data());
                console.log("📥 Callee got caller ICE");
                pc.addIceCandidate(candidate);
            }
        });
    });
};

hangupBtn.onclick = async () => {
    if (pc) pc.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());

    if (roomRef) {
        const calleeSnap = await getDocs(collection(roomRef, "calleeCandidates"));
        calleeSnap.forEach(doc => deleteDoc(doc.ref));

        const callerSnap = await getDocs(collection(roomRef, "callerCandidates"));
        callerSnap.forEach(doc => deleteDoc(doc.ref));

        await deleteDoc(roomRef);
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    alert("Call ended and room deleted");
};

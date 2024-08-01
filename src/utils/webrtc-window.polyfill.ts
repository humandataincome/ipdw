// This polyfill is needed when running in service worker or in chrome extensions background service


// @ts-ignore
import RTCPeerConnection from 'worker-webrtc/src/window/RTCPeerConnectionProxy.js';
// @ts-ignore
import * as windowWebRTC from 'worker-webrtc/window.js';


export function webRTCPolyfillListen(port: any): void {
    windowWebRTC.addListener(port, {RTCPeerConnection});
}


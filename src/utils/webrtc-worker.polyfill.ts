// This polyfill is needed when running in service worker or in chrome extensions background service

// @ts-ignore
import * as workerWebRTC from 'worker-webrtc/worker.js';

if (!globalThis.RTCPeerConnection) {
    console.log('overriding WebRTC implementation, remember to call polyfill(port) on worker and listen(port) on window');
    globalThis.RTCPeerConnection = workerWebRTC.RTCPeerConnection;
    globalThis.RTCSessionDescription = workerWebRTC.RTCSessionDescription;
    globalThis.RTCIceCandidate = workerWebRTC.RTCIceCandidate;
}

export function webRTCPolyfillCreate(port: any): void {
    workerWebRTC.addListener(port);
}

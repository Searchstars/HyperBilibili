import dayjs from "dayjs"
import { fetch } from "./tsimports"

//const TRACKER_URL: string = "https://tracker.hyperbili.astralsight.space/trackreport"
const TRACKER_URL: string = "http://192.168.1.247:4080/trackreport"
const TRACKER_SERVER_PROTOCOL_VERSION = "v1"

interface TrackedInfoUploadPacket {
    event: TIUPEvents,
    deviceInfo: TIUPDeviceInfo,
    version: string,
    payload: TIUPStartupPayload | TIUPRouterPayload | TIUPLoginPayload | TIUPLogPayload | TIUPErrorReportPayload
}

enum TIUPEvents {
    ON_STARTUP,
    ON_LOGIN,
    ON_ROUTER_PUSH,
    ON_LOG_INTERVAL,
    ON_ERROR_REPORT
}

enum TIUPErrorSeverity {
    GENERAL,
    FATAL
}

interface TIUPDeviceInfo {
    name: string,
    serial: string,
    networkType: string
}

interface TIUPStartupPayload {
    startTime: string
}

interface TIUPRouterPayload {
    currentPage: string,
    nextPage: string,
    routerStack: Array<String>
}

interface TIUPLoginPayload {
    accountName: string,
    accountUID: string
}

interface TIUPLogPayload {
    logString: string
}

interface TIUPErrorReportPayload {
    severity: TIUPErrorSeverity,
    errorInfo: string,
    logString: string,
    callStack: string
}

function canUploadTrack(): boolean {
    if (global.settings.SETTINGS.agreedAllAgreements && global.settings.SETTINGS.enableUserTracker) {
        return true;
    }
    return false;
}

function uploadTrack(event: TIUPEvents, payload) {
    const data: TrackedInfoUploadPacket = {
        event,
        deviceInfo: {
            name: global.DEVICE_INFO.product,
            serial: global.DEVICE_SERIAL,
            networkType: global.DEVICE_NETWORK_TYPE
        },
        version: global.biliclient.version,
        payload
    };

    if (canUploadTrack()) {
        fetch.fetch({
            url: `${TRACKER_URL}/${TRACKER_SERVER_PROTOCOL_VERSION}/fetch`,
            method: "POST",
            data: JSON.stringify(data),
            header: {
                "Content-Type": "application/json"
            }
        })
    }
}

//setTimeout(() => {
//    uploadTrack(TIUPEvents.ON_STARTUP, {
//        startTime: dayjs().format()
//    })
//}, 3000)
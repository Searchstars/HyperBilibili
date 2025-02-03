import { device, network, router } from "./tsimports"

export function formatNumber(num: number): string {
    if (num < 1000) {
        return num.toString();
    }
    else if (num < 10000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    else {
        return (num / 10000).toFixed(1) + 'w'
    }
}

export function getCurrentTime(): string {
    const now: Date = new Date();

    let hours: number = now.getHours();
    let minutes: number = now.getMinutes();

    const formattedHours: string = hours < 10 ? '0' + hours : hours.toString();
    const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();

    const timeString: string = `${formattedHours}:${formattedMinutes}`;

    return timeString;
}

export function getDeviceInformation(): Promise<any> {
    return new Promise((resolve, reject) => {
        device.getInfo({
            success: (data) => {
                resolve(data);
            },
            fail: (error) => {
                reject(error);
            }
        });
    });
}

export function getDeviceSerial(): Promise<any> {
    return new Promise((resolve, reject) => {
        device.getSerial({
            success: (data) => {
                resolve(data.serial);
            },
            fail: (error) => {
                router.clear();
                router.replace({
                    uri: "pages/error/permissionerror"
                });
                reject(error);
            }
        });
    });
}

export function getNetworkType(): Promise<any> {
    return new Promise((resolve, reject) => {
        network.getType({
            success: (data) => {
                resolve(data.type);
            },
            fail: (error) => {
                reject(error);
            }
        });
    });
}

export function unicodeToString(unicodeStr) {
    return unicodeStr.replace(/\\u([\dA-F]{4})/gi, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
}
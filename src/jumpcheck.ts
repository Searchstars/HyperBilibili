import { storage, router, network } from './tsimports';

export async function Jump() {
    storage.get({
        key: "bilibili_account",
        success: async (bilibili_account) => {
            if (bilibili_account.length < 1) {
                router.replace({
                    uri: "pages/app/entry/login"
                })
            } else {
                router.replace({
                    uri: "pages/app/entry/prepage"
                })
            }
        }
    })
}

export async function NetworkCheck(): Promise<boolean> {
    return new Promise((resolve) => {
        network.getType({
            success: function (data: { type: string }) {
                if (!data.type) {
                    global.logger.log('Network type is empty or undefined.');
                    resolve(false);
                } else if (data.type === 'none') {
                    resolve(false);
                } else {
                    resolve(true);
                }
            },
            fail: function () {
                global.logger.log('Failed to get network type.');
                resolve(false);
            },
            complete: function () {
                global.logger.log('Network type check completed.');
            }
        });
    });
}
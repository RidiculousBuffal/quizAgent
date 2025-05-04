import {BASE_URL, Result} from "./base.ts";
import {useUserStore} from "../store/user/UserStore.ts";

export interface UploadFileOptions {
    file: File | Blob;
    onProgress?: (percent: number, event?: ProgressEvent) => void;
    signal?: AbortSignal;
}

export function uploadFile(options: UploadFileOptions): Promise<string> {
    const {file, onProgress, signal} = options;
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        xhr.open('POST', `${BASE_URL}/upload`);
        xhr.setRequestHeader('satoken', useUserStore.getState().saToken ?? '');
        xhr.upload.onprogress = event => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded * 100) / event.total);
                onProgress(percent, event);
            }
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            try {
                const text = xhr.responseText || '{}';
                const data: Result<string> = JSON.parse(text);

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data.data);
                } else {
                    reject(
                        new Error(
                            data?.msg ||
                            `HTTP ${xhr.status}: ${xhr.statusText}`
                        )
                    );
                }
            } catch (err: any) {
                reject(err);
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error'));
        };
        if (signal) {
            signal.addEventListener('abort', () => {
                xhr.abort();
            });
        }
        xhr.send(formData);
    });
}
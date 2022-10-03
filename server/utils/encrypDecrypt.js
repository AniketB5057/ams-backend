import appConfig from "../common/appConfig";
import crypto from 'crypto';


export const encrypt = (id) => {
    id = id.toString()
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(appConfig.algorithm, appConfig.sercetKey, iv);
    const encrypted = Buffer.concat([cipher.update(id), cipher.final()]);

    let hash = `${iv.toString('hex')}-${encrypted.toString('hex')}`
    return hash
};

export const decrypt = (data) => {
    data = data.split("-");
    let hash = { "iv": data[0], "content": data[1] };
    const decipher = crypto.createDecipheriv(appConfig.algorithm, appConfig.sercetKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};
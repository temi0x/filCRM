export interface mess {
  [index: string]: {
    content: string;
    read: boolean;
    date?: number | string;
    sender: string;
  }[];
}


export const decryptCache: { [index: string]: string } = {

}

export const encrypt = async (text: string, keys: string) => {


    const { private: privateKey, public: publicKey } = JSON.parse(keys);

    const receiverPublicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );

    const senderPrivateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    const deriveKey = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: receiverPublicKey,
      },
      senderPrivateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );


    const encodedText = new TextEncoder().encode(text);
    const encodedIv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: encodedIv,
      },
      deriveKey,
      encodedText
    );

    const encryptedMessage = new Uint8Array(encryptedData);

    const encryptedHex = Buffer.from(encryptedMessage).toString("hex");

    const encryptedIv = Buffer.from(encodedIv).toString("hex");


    return { message: encryptedHex, iv: encryptedIv }; 

}


export const decrypt = async (encryptedText: { message: string, iv: string }, keys: string) => {


    if (decryptCache[Object.values(encryptedText).join('')] !== undefined) {
        return decryptCache[Object.values(encryptedText).join("")];
    }

    try {
    
    const { private: privateKey, public: publicKey } = JSON.parse(keys);

    const receiverPrivateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    const senderPublicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKey,
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      []
    );


    const deriveKey = await window.crypto.subtle.deriveKey(
      {
        name: "ECDH",
        public: senderPublicKey,
      },
      receiverPrivateKey,
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    

    const encryptedMessage = Buffer.from(encryptedText.message, "hex");
    const encryptedIv = Buffer.from(encryptedText.iv, "hex");

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: encryptedIv,
      },
      deriveKey,
      encryptedMessage
    );

    const decryptedMessage = new Uint8Array(decryptedData);

    const decryptedText = new TextDecoder().decode(decryptedMessage);

    decryptCache[Object.values(encryptedText).join("")] = decryptedText;

    return decryptedText;

  } catch(err) {
    // console.log(err, keys, 'dmc');
    console.log('pending....');

    return "...";
  }
    
}


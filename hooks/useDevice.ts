import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

export const googCheck = async () => {
  try {
    const online = await fetch("https://google.com",{
        mode: 'no-cors',
        cache: 'no-cache',
    });
    return online.status >= 200 && online.status < 300; // either true or false
  } catch (err) {
    return false; // definitely offline
  }
};

export const useVibrate = (
  on?: boolean | undefined,
  pattern?: number | number[]
) => {
  if(on === true) {
    return navigator.vibrate(pattern);
  }
  if(on === false) {
    return navigator.vibrate([]);
  }
}

export const deviceMediaCapability = (
  method: 'encode' | 'decode',
  opts: {
    mediaType: MediaDecodingConfiguration | MediaEncodingType,
    sourceType: 'audio'|'video',
    contentType?: string,
  },
  config: {
    contentType?: string | undefined,
    channels?: number | undefined,
    bitrate?: number | undefined,
    samplerate?: number | undefined,
    width?: number | undefined,
    height?: number | undefined,
    framerate?: number | undefined,
    scalabilityMode?: string | undefined,
  },
) => {

  const audio = {
    contentType : config.contentType,
    channels : config.channels.toString(),
    bitrate : config.bitrate,
    samplerate : config.samplerate, }
  
  const video = {
    contentType: config.contentType,
    width: config.width,
    height: config.height,
    bitrate: config.bitrate,
    framerate: config.framerate,
    scalabilityMode: config.scalabilityMode ? config.scalabilityMode : undefined, }
  
  let info: any;
  if(opts.sourceType === 'audio')
    info = { type: 'file', audio: audio }
  if(opts.sourceType === 'video')
    info = { type: 'file', video: video }

  if(method === 'decode')
    navigator.mediaCapabilities.decodingInfo(info).then((result): MediaCapabilitiesInfo => {
      return {
        smooth: result.smooth ? true : false,
        supported: result.supported ? true : false,
        powerEfficient: result.powerEfficient ? true : false,
      }
    });
  
  if(method === 'encode')
    navigator.mediaCapabilities.encodingInfo(info).then((result): MediaCapabilitiesInfo => {
      return {
        smooth: result.smooth ? true : false,
        supported: result.supported ? true : false,
        powerEfficient: result.powerEfficient ? true : false,
      }
    });
  
}

export const useDevice = () => {

  const [navInfo, setNavInfo] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator) {
      setNavInfo({
        userAgent: window.navigator.userAgent,
        platform: window.navigator.platform,
        appName: window.navigator.appName,
        appVersion: window.navigator.appVersion,
      });
    }
  }, []);

  const nav: any = navInfo;
  const online: boolean = nav.onLine ? true : false;

  const touchDevice: number = nav.maxTouchPoints;
  const hasCamera: boolean = 'mediaDevices' in nav && 'getUserMedia' in nav.mediaDevices ? true : false;

  const wifiConnection = () => {
    if(online && nav.product.toLowerCase() !== "gecko") {
      const connection = online
      ? (nav.connection || nav.webkitConnection)
      : { effectiveType: undefined, type: undefined };
      const effectiveType = connection ? connection.effectiveType : undefined;
      const type = connection ? connection.type : undefined;
      return {
        connection: connection,
        effectiveType: effectiveType,
        type: type,
      }
    } // If all else fails...
    return {
      connection: 'offline',
      type: undefined
    }
  }

  return {
    isOnline: online,
    wifiConnection: wifiConnection(),
    touch: {
      is: touchDevice > 0 ? true : false,
      multi: touchDevice > 1 ? true : false,
      points: touchDevice
    },
    haptics: useVibrate,
    preferredLanuage: navigator.language,
    hasCamera: hasCamera,
    connectedDevices: nav.hid,
    isMobile: isMobile,
  }
}
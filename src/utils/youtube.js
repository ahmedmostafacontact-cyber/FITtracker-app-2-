const validId=/^[A-Za-z0-9_-]{11}$/;
function seconds(text){
 if(!text)return 0;
 if(/^\d+$/.test(text)){const value=Number(text);return Number.isSafeInteger(value)?value:0;}
 const m=/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i.exec(text);
 if(!m)return 0;
 const value=Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0);
 return Number.isSafeInteger(value)?value:0;
}
export function parseYouTubeUrl(input){
 if(typeof input!=='string'||!input.trim())return null;
 const value=input.trim();if(validId.test(value))return {id:value,start:0};
 try{
 const url=new URL(/^https?:\/\//i.test(value)?value:'https://'+value);
 if(!['https:','http:'].includes(url.protocol)||url.username||url.password)return null;
 const host=url.hostname.toLowerCase();let id;
 if(['youtu.be','www.youtu.be'].includes(host)){const parts=url.pathname.split('/').filter(Boolean);if(parts.length!==1)return null;id=parts[0];}
 else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com'].includes(host)){
 if(url.pathname==='/watch')id=url.searchParams.get('v');
 else {const match=/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{11})\/?$/.exec(url.pathname);id=match?.[1];}
 }else return null;
 return id&&validId.test(id)?{id,start:seconds(url.searchParams.get('t')??url.searchParams.get('start'))}:null;
 }catch{return null;}
}
export const youtubeThumbnail=id=>`https://img.youtube.com/vi/${id}/hqdefault.jpg`;
export const youtubeWatchUrl=id=>`https://www.youtube.com/watch?v=${id}`;

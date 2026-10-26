import {parseYouTubeUrl,youtubeThumbnail,youtubeWatchUrl} from '../src/utils/youtube';
const id='dQw4w9WgXcQ';
test.each([
 [`https://www.youtube.com/watch?v=${id}`,0],[`https://youtu.be/${id}?t=90`,90],[`https://youtu.be/${id}?t=1m30s`,90],
 [`https://www.youtube.com/shorts/${id}`,0],[`https://www.youtube.com/embed/${id}`,0],[`https://m.youtube.com/watch?v=${id}&feature=share`,0],
 [id,0],[`https://music.youtube.com/watch?v=${id}&start=1h2m3s`,3723],[`https://youtube.com/live/${id}`,0]
])('parses %s',(url,start)=>expect(parseYouTubeUrl(url)).toEqual({id,start}));
test.each(['hello','',null,123,`https://example.com/watch?v=${id}`,`https://youtube.com.evil.example/watch?v=${id}`,`https://youtube.com@evil.example/watch?v=${id}`,`https://youtube.com/embed/short`,`javascript:alert(1)`])('rejects invalid or deceptive URL %s',url=>expect(parseYouTubeUrl(url)).toBeNull());
test('invalid timestamp is zero, and helpers use HTTPS',()=>{expect(parseYouTubeUrl(`https://youtu.be/${id}?t=-2`)).toEqual({id,start:0});expect(youtubeThumbnail(id)).toBe(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);expect(youtubeWatchUrl(id)).toBe(`https://www.youtube.com/watch?v=${id}`);});

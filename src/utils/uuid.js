let counter = 0;
export function uuid() {
 let now = Date.now() + counter++;
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = (now + Math.random() * 16) % 16 | 0;
  now = Math.floor(now / 16);
  return (c === 'x' ? r : (r & 3) | 8).toString(16);
 });
}
